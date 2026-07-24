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

  try {
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
  } catch (error) {
    console.error(`Error fetching ${owner}/${repo}:`, error);
    return null;
  }
}

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "Warning: No GITHUB_TOKEN provided. GitHub API rate limits may apply."
    );
  }

  // Read existing star counts (if any) so failed requests don't erase them.
  let result = {};

  if (fs.existsSync(outputPath)) {
    try {
      result = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    } catch (error) {
      console.warn(
        "Warning: Could not read existing scenario-stars.json. A new file will be created."
      );
    }
  }

  for (const template of templates) {
    if (!template.source) continue;

    const repoInfo = getRepoSlug(template.source);

    if (!repoInfo) continue;

    const stars = await fetchStars(repoInfo.owner, repoInfo.repo);

    // Only overwrite if the fetch succeeded.
    if (stars !== null) {
      result[template.source] = {
        stars,
      };

      console.log(`${repoInfo.owner}/${repoInfo.repo}: ${stars}`);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log("scenario-stars.json updated!");
}

main();