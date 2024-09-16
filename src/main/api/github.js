const {
  createTeamAndUsers,
  getTeamAndUsers,
} = require("../services/teams.services");
const {
  createLabsAndPulls,
  getLabAndPulls,
} = require("../services/labs.services");

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

const getPulls = async (labName) => {
  try {
    const octokit = await loadApp();
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: organization,
      repo: labName,
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
      updated_at: pullData.updated_at,
      user: pullData.user.login,
    }));

    await createLabsAndPulls({ lab: labName, pulls: pulls });
    return pulls;
  } catch (error) {
    console.error(error);
  }
};

const getUsersPulls = async (team, labName) => {
  const teamSlug = team.toLowerCase().replace(/\s+/g, "-");
  try {
    const teamAndUsersData = await getTeamAndUsers(teamSlug);

    const members = teamAndUsersData
      ? teamAndUsersData
      : await getTeamMembers(team);

    const labAndPullsData = await getLabAndPulls(labName);

    const pulls = labAndPullsData ? labAndPullsData : await getPulls(labName);

    

    /*    const filteredPullsByTeamMembers = pullsList[`pulls-${labName}`].filter(
      (el) => members[`members${team}`]?.includes(el.user)
    );

    return filteredPullsByTeamMembers; */
  } catch (error) {
    console.error(error);
  }
};

const getTeamMembers = async (selectedTeam) => {
  const teamSlug = selectedTeam.toLowerCase().replace(/\s+/g, "-");
  try {
    const octokit = await loadApp();

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
    await createTeamAndUsers(teamSlug, members);
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
