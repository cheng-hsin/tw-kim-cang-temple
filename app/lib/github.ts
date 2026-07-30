// 後台上傳圖片/電子書時,順便把檔案用 GitHub Contents API commit 推到 repo,
// 這樣就算伺服器重啟或重新部署,寫在 public/ 底下的檔案也不會不見。
// 需要一組有 repo 內容讀寫權限的 Personal Access Token,設定在 GITHUB_TOKEN(見 .env.example)。
// 沒設定 token 時視為沒啟用這個功能,直接跳過,不會讓上傳失敗。

const GITHUB_API = "https://api.github.com";

type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

function getConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  return {
    token,
    owner: process.env.GITHUB_REPO_OWNER || "cheng-hsin",
    repo: process.env.GITHUB_REPO_NAME || "tw-kim-cang-temple",
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

function contentsUrl(owner: string, repo: string, filePath: string): string {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  return `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodedPath}`;
}

function githubFetch(url: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "tw-kim-cang-temple-admin-upload",
      ...(init?.headers ?? {}),
    },
  });
}

async function getFileSha(config: GithubConfig, filePath: string): Promise<string | null> {
  const res = await githubFetch(
    `${contentsUrl(config.owner, config.repo, filePath)}?ref=${config.branch}`,
    config.token
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`讀取 GitHub 檔案資訊失敗(${res.status}):${await res.text()}`);
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

async function commitFile(filePath: string, buffer: Buffer, message: string): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const sha = await getFileSha(config, filePath);
  const res = await githubFetch(contentsUrl(config.owner, config.repo, filePath), config.token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: buffer.toString("base64"),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`上傳檔案到 GitHub 失敗(${res.status}):${await res.text()}`);
  }
}

async function deleteFile(filePath: string, message: string): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const sha = await getFileSha(config, filePath);
  if (!sha) return; // GitHub 上本來就沒有這個檔案

  const res = await githubFetch(contentsUrl(config.owner, config.repo, filePath), config.token, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: config.branch }),
  });
  if (!res.ok) {
    throw new Error(`從 GitHub 刪除檔案失敗(${res.status}):${await res.text()}`);
  }
}

// 這兩個是「盡力而為」版本:失敗只印 log,不會讓呼叫端的上傳/刪除動作跟著失敗
// (本機檔案已經寫好了,GitHub 只是額外的備份,不該擋住管理員當下的操作)。

export async function commitFileBestEffort(
  filePath: string,
  buffer: Buffer,
  message: string
): Promise<void> {
  try {
    await commitFile(filePath, buffer, message);
  } catch (err) {
    console.error(`[github] 備份 ${filePath} 失敗:`, err);
  }
}

export async function deleteFileBestEffort(filePath: string, message: string): Promise<void> {
  try {
    await deleteFile(filePath, message);
  } catch (err) {
    console.error(`[github] 從備份刪除 ${filePath} 失敗:`, err);
  }
}
