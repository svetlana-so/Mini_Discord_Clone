import crypto from "crypto";

export const generateRandomId = (length = 8) =>
  crypto.randomBytes(length).toString("hex");
