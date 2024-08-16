const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const filterPulls = require("./github");
// If modifying these scopes, delete token.json.
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
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function writeIntersection(auth) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const githubData = await filterPulls();
    const indexBlock = await getIndexBlock(sheets, "BLOCK 1");
    const columnIndex = await getColumnIndexFromLabName(
      sheets,
      indexBlock,
      "JS Animations"
    );

    return githubData.map(async (pull) => {
      const rowIndex = await getRowIndexFromGithubUser(
        sheets,
        indexBlock,
        pull.user
      );

      if (columnIndex && rowIndex) {
        const res = sheets.spreadsheets.values.update({
          spreadsheetId: "1yb3O4D1v0uSNRID4Fg5yY9tCurBxAQ9uD1sJP5gDBhs",
          range: `Lab Tracker!${columnIndex}${rowIndex}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[""]],
          },
        });
        return res;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const getIndexBlock = async (sheets, block) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1yb3O4D1v0uSNRID4Fg5yY9tCurBxAQ9uD1sJP5gDBhs",
    range: "Lab Tracker!A:A",
  });

  const columns = res.data.values;
  if (!columns || columns.length === 0) {
    console.log("No data found.");
    return;
  }
  if (columns.length !== 0) {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i][0] === block.toUpperCase()) {
        return i + 1;
      }
    }
  }
};

const getRowIndexFromGithubUser = async (sheets, block, githubName) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1yb3O4D1v0uSNRID4Fg5yY9tCurBxAQ9uD1sJP5gDBhs",
    range: "Lab Tracker!B:B",
  });
  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }
  if (rows.length !== 0) {
    for (let i = block; i < rows.length; i++) {
      if (rows[i][0] === githubName) {
        return i + 1;
      }
    }
  }
};

const getColumnIndexFromLabName = async (sheets, block, labName) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1yb3O4D1v0uSNRID4Fg5yY9tCurBxAQ9uD1sJP5gDBhs",
    range: "Lab Tracker!D:R",
  });
  const columns = res.data.values;
  if (!columns || columns.length === 0) {
    console.log("No data found.");
    return;
  }
  if (columns.length !== 0) {
    for (let i = block; i < columns.length; i++) {
      if (columns[i + 1].length === 0) return;
      for (let j = 0; j < columns[i].length; j++) {
        if (columns[i][j] === labName) {
          return convertIndexToLetter(j + 3);
        }
      }
    }
  }
};

function convertIndexToLetter(index) {
  let letter = "";
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

authorize().then(writeIntersection).catch(console.error);
