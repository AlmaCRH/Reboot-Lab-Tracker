const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { filterPullsByUsers } = require("./github");
const { githubData } = require("./utils");


const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
const writeIntersection = async (auth) => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const { rows, columns } = await getIndexWithBatchGet(sheets);
    const pulls = await filterPullsByUsers();
    const rowsIndex = await getRowIndex(rows, pulls);
    const columnsIndex = await getColumnIndex(sheets, columns, githubData.lab);

    const data = [];
    rowsIndex.map((index) => {
      data.push({
        range: `Lab Tracker!${columnsIndex}${index}`,
        values: [[""]],
      });
    });

    const body = {
      data: data,
      valueInputOption: "USER_ENTERED",
    };

    return sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: process.env.SPREADSHEET_ID,
      resource: body,
    });
  } catch (error) {
    console.log(error);
  }
};

const getRowIndex = async (rows, pulls) => {
  try {
    const index = [];
    for (const pull of pulls) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes(pull.user)) {
          index.push(i + 4);
        }
      }
    }
    return index;
  } catch (error) {
    console.log(error);
  }
};

const getIndexWithBatchGet = async (sheets) => {
  try {
    const blocksRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Lab Tracker!A:A",
    });

    const blocks = blocksRes.data.values.flat();

    const startRow = blocks.findIndex(
      (value) => value.trim().toUpperCase() === "BLOCK 1"
    );
    const endRow = blocks.findIndex(
      (value) => value.trim().toUpperCase() === "BLOCK 2"
    );

    if (startRow === -1 || endRow === -1 || startRow >= endRow) {
      console.error("Blocks not found");
      return;
    }

    const ranges = [
      `Lab Tracker!B${startRow === 0 ? +4 : +0}:B${endRow + 1}`,
      `Lab Tracker!D${startRow === 0 ? +3 : +0}:R${startRow === 0 ? +3 : +0}`,
    ];

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.SPREADSHEET_ID,
      ranges: ranges,
    });

    const result = res.data.valueRanges;

    const rows = result[0].values.flat();
    const columns = result[1].values.flat();
    return { rows: rows, columns: columns };
  } catch (error) {
    console.error(error.message);
  }
};

const getColumnIndex = async (columns, labName) => {
  try {
    const targetPart = labName.split("-").slice(2).join("-");
    const regexPattern = targetPart.replace(/-/g, "[\\s-&]+");
    const regex = new RegExp(`^${regexPattern}$`, "i");

    for (let i = 0; i < columns.length; i++) {
      if (regex.test(columns[i])) {
        return convertIndexToLetter(i + 3);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const convertIndexToLetter = (index) => {
  let letter = "";
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
};

const loadScript = () => {
  authorize()
    .then((auth) => writeIntersection(auth))
    .catch(console.error);
};

module.exports = { loadScript };
