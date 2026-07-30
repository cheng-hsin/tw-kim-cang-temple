// 後台上傳圖片/電子書時,把檔案用 GitHub Contents API commit 推到 repo。
// 這是正式站(Vercel 等平台的檔案系統唯讀,執行階段沒辦法直接寫入 public/)真正的持久化方式:
// 本機檔案系統寫入只是「有的話盡量寫」,commit 到 GitHub 才是實際會留下來的資料,
// 推上去之後,如果部署平台有接 GitHub 自動部署,會自動觸發重新部署把新檔案帶進下一次的 build。
// 需要一組有 repo 內容讀寫權限的 Personal Access Token,設定在 GITHUB_TOKEN(見 .env.example)。
// 沒設定 token 時視為沒啟用這個功能,回傳 false,讓呼叫端知道沒有真的備份成功。

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

async function commitFile(
  config: GithubConfig,
  filePath: string,
  buffer: Buffer,
  message: string
): Promise<void> {
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

async function deleteFile(config: GithubConfig, filePath: string, message: string): Promise<void> {
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

// 這兩個回傳 boolean 而不是丟例外:呼叫端(imageSlots/ebooks)要知道「有沒有真的備份成功」,
// 才能在本機寫入也失敗時(例如正式站唯讀檔案系統),決定要不要回報上傳失敗給管理員。
// 沒設定 GITHUB_TOKEN 時安靜回傳 false,不印 log(這是合法的「沒啟用」狀態,不是錯誤)。

export async function commitFileBestEffort(
  filePath: string,
  buffer: Buffer,
  message: string
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;

  try {
    await commitFile(config, filePath, buffer, message);
    return true;
  } catch (err) {
    console.error(`[github] 備份 ${filePath} 失敗:`, err);
    return false;
  }
}

export async function deleteFileBestEffort(filePath: string, message: string): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;

  try {
    await deleteFile(config, filePath, message);
    return true;
  } catch (err) {
    console.error(`[github] 從備份刪除 ${filePath} 失敗:`, err);
    return false;
  }
}
