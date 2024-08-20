require("dotenv").config();
const { getItem, setItem, obj } = require("./utils");

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
      repo: "LAB-110-html-tables-forms",
      accept: "application/vnd.github+json",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      sort: "created",
      state: "open",
      direction: "desc",
      per_page: 30,
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
    let members = await getItem(`members${obj.team}`);
    let pullsMembers = await getItem("pulls");

    if (!members?.includes(obj.team)) {
      const [allPulls, usersList] = await Promise.all([
        listAllPulls(),
        getAllTeamMembers(),
      ]);
      await setItem("members", usersList);
      await setItem("pulls", allPulls);
      members = usersList;
      pullsMembers = allPulls;
    } else {
      console.log("a");
      const pulls = pullsMembers?.filter((el) => members.includes(el.user));
      console.log(pulls);
    }
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
        team_slug: obj.team,
        per_page: 35,
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
module.exports = filterPullsByUsers;
