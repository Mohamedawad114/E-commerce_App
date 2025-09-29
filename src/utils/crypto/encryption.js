import crypto from "node:crypto";
import env from "dotenv";
env.config({ path: "./.dev.env" });
function encryption(text) {
  const buffer = Buffer.from(text);
  const encrypted = crypto.publicEncrypt(
    {
      key: process.env.PUBLICKEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );
  return encrypted.toString("hex");
}

export  {encryption};
