require("dotenv").config();
const { getItem, setItem, githubData } = require("./utils");

const appID = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const installationID = process.env.INSTALLATION_ID;
const organization = process.env.ORG;

const loadApp = async () => {
  try {
    const { App } = await import("@octokit/app");
    const app = new App({ appId: appID, privateKey: privateKey });
    return app.getInstallationOctokit(installationID);
  } catch (error) {
    console.error(error);
  }
};

// Pull request filter
const listAllPulls = async () => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: organization,
      repo: githubData.lab,
      accept: "application/vnd.github+json",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      sort: "created",
      state: "open",
      direction: "desc",
      per_page: 50,
    });
    const pulls = data.map((pullData) => ({
      created_at: pullData.created_at,
      user: pullData.user.login,
    }));

    return pulls;
  } catch (error) {
    console.error(error);
  }
};

const filterPullsByUsers = async () => {
  try {
    let members = await getItem();
    let pullsList = await getItem("pulls");

    if (!members || !members[`members${githubData.team}`]) {
      const usersList = await getAllTeamMembers();
      await setItem(`members${githubData.team}`, usersList);
      members = { [`members${githubData.team}`]: usersList };
    }
    if (!pullsList || !pullsList[`pulls-${githubData.lab}`]) {
      const allPulls = await listAllPulls();
      await setItem(`pulls-${githubData.lab}`, allPulls);
      pullsList = { [`pulls-${githubData.lab}`]: allPulls };
    }
    const filteredPullsByMembers = pullsList[`pulls-${githubData.lab}`].filter(
      (el) => members[`members${githubData?.team}`].includes(el.user)
    );

    return filteredPullsByMembers;
  } catch (error) {
    console.error(error);
  }
};

// Teams filter
const getAllTeamMembers = async () => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request(
      "GET /orgs/{org}/teams/{team_slug}/members",
      {
        org: organization,
        team_slug: githubData.team,
        role: "member",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const members = data.map((member) => member.login);
    return members;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { filterPullsByUsers, loadApp };
