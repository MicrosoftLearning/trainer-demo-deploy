const fs = require("fs");
const path = require("path");

const templatesPath = path.join(__dirname, "../static/templates.json");
const outputPath = path.join(__dirname, "../static/scenario-stars.json");

const templates = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

function getRepoSlug(url) {
  if (!url) return null;

  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);

  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2].replace(".git", ""),
  };
}

async function fetchStars(owner, repo) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  if (!response.ok) {
    console.log(
      `Failed: ${owner}/${repo} - ${response.status} ${response.statusText}`
    );
    return null;
  }

  const data = await response.json();
  return data.stargazers_count;
}

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "Warning: No GITHUB_TOKEN provided. GitHub API rate limits may apply."
    );
  }

  const result = {};

  for (const template of templates) {
    if (!template.source) continue;

    const repoInfo = getRepoSlug(template.source);

    if (!repoInfo) continue;

    const stars = await fetchStars(repoInfo.owner, repoInfo.repo);

    if (stars !== null) {
      result[template.source] = {
        stars,
      };

      console.log(`${repoInfo.owner}/${repoInfo.repo} : ${stars}`);
    }
  }

  if (Object.keys(result).length === 0) {
    console.log(
      "No stars fetched. Keeping existing scenario-stars.json unchanged."
    );
    return;
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log("scenario-stars.json updated!");
}

main();