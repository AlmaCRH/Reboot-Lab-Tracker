require("dotenv").config();

const loadApp = async () => {
  try {
    const { App } = await import("@octokit/app");
    const app = new App({ appId: appID, privateKey: privateKey });
    return app.getInstallationOctokit(installationID);
  } catch (error) {
    console.log(error);
  }
};

const appID = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const installationID = process.env.INSTALLATION_ID;


// Pull request filter
const listAllPulls = async () => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: process.env.OWNER,
      repo: "LAB-110-html-tables-forms",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      sort: "created",
      state: "open",
      direction: "desc",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const filterPulls = async () => {
  const allPulls = await listAllPulls();
  const usersList = await arrayMembers();

  const pulls = allPulls
    .filter((el) => usersList.includes(el.user.login))
    .map((el) => ({ created_at: el.created_at, user: el.user.login }));
  return pulls;
};

// Teams filter

const getAllTeamMembers = async () => {
  const octokit = await loadApp();
  const { data } = await octokit.request(
    "GET /orgs/{org}/teams/{team_slug}/members",
    {
      org: "rebootacademy-labs",
      team_slug: "SCE-6",
      per_page: 50,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  return data;
};

const arrayMembers = async () => {
  const teamMembers = await getAllTeamMembers();
  const members = teamMembers.map((user) => user.login);
  return members;
};

module.exports = filterPulls;
