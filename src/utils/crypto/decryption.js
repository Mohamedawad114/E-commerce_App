import crypto from "node:crypto";
import env from "dotenv";
env.config({ path: "./dev.env" });
function decryption(encryptedtext) {
  const buffer = Buffer.from(encryptedtext, "hex");
  const decrypted = crypto.privateDecrypt(
    {
      key: process.env.PRIVATEKEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );
  return decrypted.toString("utf-8");
}

export  {decryption};
