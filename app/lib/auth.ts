import crypto from "node:crypto";

// 檢查後台登入帳密是否正確,帳密設定在環境變數裡(見 .env.example)。

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // 長度不同時仍做一次比較,避免用回應時間差猜出正確長度
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  return (
    timingSafeEqualString(username, expectedUser) &&
    timingSafeEqualString(password, expectedPass)
  );
}
