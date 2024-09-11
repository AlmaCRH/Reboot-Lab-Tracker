const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { getUsersPulls } = require("./github");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
];
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

const writeIntersection = async (auth, frontData) => {
  const { bootcamp, lab, block } = frontData;
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const { rows, columns, startRow, endRow } = await getIndexWithBatchGet(
      sheets,
      bootcamp,
      block
    );

    const pulls = await getUsersPulls("Bootcamp eCommerce 01", lab);
    const rowsIndex = await getRowIndex(pulls, rows, startRow, endRow);
    const columnsIndex = await getColumnIndex(columns, lab);
    const data = [];

    rowsIndex.map((index) => {
      pulls.map((pull) => {
        data.push({
          range: `Lab Tracker!${columnsIndex}${index}`,
          values: [[`Delivered at ${formatPullDate(pull.created_at)}`]],
        });
      });
    });

    const body = {
      data: data,
      valueInputOption: "USER_ENTERED",
    };

    return sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: bootcamp,
      resource: body,
    });
  } catch (error) {
    console.log(error);
  }
};

const formatPullDate = (date) => {
  const dateStr = date;
  const dateObj = new Date(dateStr);

  const formattedDate = dateObj
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");

  return formattedDate;
};

const getRowIndex = async (pulls, rows, startRow, endRow) => {
  try {
    const index = [];

    const offset = startRow;

    const adjustedStart = startRow - offset;
    const adjustedEnd = endRow - offset;

    for (const pull of pulls) {
      for (let i = adjustedStart; i < adjustedEnd; i++) {
        if (rows[i] && rows[i].includes(pull.user)) {
          index.push(i + offset + 4);
        }
      }
    }

    return index;
  } catch (error) {
    console.log(error);
  }
};

const getIndexWithBatchGet = async (sheets, bootcampId, block) => {
  try {
    const blocksRes = await sheets.spreadsheets.values.get({
      spreadsheetId: bootcampId,
      range: "Lab Tracker!A:A",
    });

    const blocks = blocksRes.data.values.flat();

    let endBlock;
    if (block === "BLOCK 1") {
      endBlock = "BLOCK 2";
    } else if (block === "BLOCK 2") {
      endBlock = "BLOCK 3";
    } else {
      endBlock = "TOTAL";
    }

    const startRow = blocks.findIndex(
      (value) => value.trim().toUpperCase() === block
    );
    const endRow = blocks.findIndex(
      (value) => value.trim().toUpperCase() === endBlock
    );

    if (startRow === -1 || endRow === -1 || startRow >= endRow) {
      console.error("Blocks not found");
      return;
    }

    const ranges = [
      `Lab Tracker!B${startRow + 4}:B${endRow + 1}`,
      `Lab Tracker!D${startRow + 3}:R${startRow + 3}`,
    ];

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: bootcampId,
      ranges: ranges,
    });

    const result = res.data.valueRanges;
    const rows = result[0].values.flat().filter((value) => value !== undefined);
    const columns = result[1].values.flat();

    return { rows: rows, columns: columns, startRow: startRow, endRow: endRow };
  } catch (error) {
    console.error(error.message);
  }
};

const getColumnIndex = async (columns, labName) => {
  try {
    const targetPart = labName.split("-").slice(2).join("-");
    const regexPattern = targetPart.replace(/-/g, "[\\s&-]*");
    const regex = new RegExp(`${regexPattern}`, "i");

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

const loadScript = (fun, arg1, arg2) => {
  if (typeof fun !== "function") {
    console.error("Passed parameter is not a function");
    return;
  }

  return authorize()
    .then((auth) => fun(auth, arg1, arg2))
    .catch(console.error);
};

// Drive API testing

const listFiles = async (auth) => {
  const drive = google.drive({ version: "v3", auth: auth });
  const res = await drive.files.list({
    q: "name contains 'Student Information'",
    pageSize: 10,
    fields: "nextPageToken, files(id,name)",
    spaces: "drive",
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  const filesData = files.map((file) => {
    const nameFormatted = file.name.replace("- Student Information", "");
    return { name: nameFormatted, id: file.id };
  });

  return filesData;
};

module.exports = { loadScript, listFiles, writeIntersection };
