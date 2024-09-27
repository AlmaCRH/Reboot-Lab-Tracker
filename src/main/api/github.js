const {
  createTeamAndUsers,
  getUsersWithTeamsAndPullsByLab,
  addLabToTeam,
} = require("../services/teams.services");

const { createPullsWithUsersAndLab } = require("../services/pulls.services");

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

const getPulls = async (labName, teamName) => {
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
      githubUser: pullData.user.login,
      repo_url: pullData.html_url,
      pr_number: pullData.number,
      pr_status: pullData.state,
      createdAt: pullData.created_at,
      updatedAt: pullData.updated_at,
    }));

    if (!pulls || pulls.length === 0) {
      console.log("No pulls found");
      return;
    }

    await addLabToTeam({ teamName, labName });

    await createPullsWithUsersAndLab({ pullsData: pulls, lab: labName });

    return pulls;
  } catch (error) {
    console.error(error);
  }
};

const getUsersPulls = async (team, labName) => {
  const teamSlug = team.toLowerCase().replace(/\s+/g, "-");
  try {
    const pullsList = await getUsersWithTeamsAndPullsByLab(teamSlug, labName);
    if (pullsList) {
      return pullsList;
    } else {
      await getTeamMembers(teamSlug);
      await getPulls(labName, teamSlug);
      return await getUsersPulls(team, labName);
    }
  } catch (error) {
    console.error(error);
  }
};

const getTeamMembers = async (selectedTeam) => {
  try {
    const octokit = await loadApp();

    const { data } = await octokit.request(
      "GET /orgs/{org}/teams/{team_slug}/members",
      {
        org: organization,
        team_slug: selectedTeam,
        role: "member",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const members = data.map((member) => member.login);
    await createTeamAndUsers(selectedTeam, members);
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
