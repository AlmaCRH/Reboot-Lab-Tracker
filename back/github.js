const {
  getItemFromStorageJSON,
  setItemInStorageJSON,
  githubData,
} = require("./utils");

const appID = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const installationID = process.env.INSTALLATION_ID;
const organization = process.env.ORG;
const webhookSecret = process.env.WEBHOOK_SECRET;

const loadApp = async () => {
  try {
    const { App } = await import("@octokit/app");
    const app = new App({
      appId: appID,
      privateKey: privateKey,
      webhooks: {
        secret: webhookSecret,
      },
    });
    return app.getInstallationOctokit(installationID);
  } catch (error) {
    console.error(error);
  }
};

const getPulls = async () => {
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

const getUsersPulls = async () => {
  try {
    let members = await getItemFromStorageJSON();
    let pullsList = await getItemFromStorageJSON("pulls");

    if (!members || !members[`members${githubData.team}`]) {
      const usersList = await getTeamMembers();
      await setItemInStorageJSON(`members${githubData.team}`, usersList);
      members = { [`members${githubData.team}`]: usersList };
    }
    if (!pullsList || !pullsList[`pulls-${githubData.lab}`]) {
      const allPulls = await getPulls();
      await setItemInStorageJSON(`pulls-${githubData.lab}`, allPulls);
      pullsList = { [`pulls-${githubData.lab}`]: allPulls };
    }
    const filteredPullsByTeamMembers = pullsList[
      `pulls-${githubData.lab}`
    ].filter((el) => members[`members${githubData?.team}`].includes(el.user));

    return filteredPullsByTeamMembers;
  } catch (error) {
    console.error(error);
  }
};

const getTeamMembers = async () => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request("GET /orgs/{org}/teams/", {
      org: organization,
      team_slug: githubData.team,
      "@": "AlmaCRH",
      role: "member",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log(data);

    const members = data.map((member) => member.login);
    return members;
  } catch (error) {
    console.error(error);
  }
};
(async () => await getTeamMembers())();
module.exports = { getUsersPulls };
