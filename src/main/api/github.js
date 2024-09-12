const { getItemFromStorageJSON, setItemInStorageJSON } = require("./utils");

const appID = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const installationID = process.env.INSTALLATION_ID;
const organization = process.env.ORG;

const loadApp = async () => {
  try {
    const { App } = await import("@octokit/app");
    const app = new App({
      appId: appID,
      privateKey: privateKey,
    });
    return app.getInstallationOctokit(installationID);
  } catch (error) {
    console.error(error);
  }
};

const getPulls = async (lab) => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: organization,
      repo: lab,
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

const getUsersPulls = async (team, labName) => {
  try {
    let members = await getItemFromStorageJSON();
    let pullsList = await getItemFromStorageJSON("pulls");

    if (!members || !members[`members${team}`]) {
      const usersList = await getTeamMembers(team);
      await setItemInStorageJSON(`members${team}`, usersList);
      members = { [`members${team}`]: usersList };
    }
    if (!pullsList || !pullsList[`pulls-${labName}`]) {
      const allPulls = await getPulls(labName);
      await setItemInStorageJSON(`pulls-${labName}`, allPulls);
      pullsList = {
        [`pulls-${labName}`]: allPulls,
      };
    }
    const filteredPullsByTeamMembers = pullsList[`pulls-${labName}`].filter(
      (el) => members[`members${team}`]?.includes(el.user)
    );

    return filteredPullsByTeamMembers;
  } catch (error) {
    console.error(error);
  }
};

const getTeamMembers = async (selectedTeam) => {
  try {
    const octokit = await loadApp();
    const teams = await octokit.request("GET /orgs/{org}/teams", {
      org: organization,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const team = teams?.data.filter((team) => {
      return team.name.toLowerCase().includes(selectedTeam.toLowerCase());
    });
    const teamSlug = team[0].name.toLowerCase().replace(/\s+/g, "-");
    const { data } = await octokit.request(
      "GET /orgs/{org}/teams/{team_slug}/members",
      {
        org: organization,
        team_slug: teamSlug,
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

const getAllLabs = async () => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request("GET /orgs/{org}/repos", {
      org: organization,
      type: "all",
      per_page: 100,
    });
    const labs = data.map((lab) => lab.name);
    return labs;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { getUsersPulls, getAllLabs };
