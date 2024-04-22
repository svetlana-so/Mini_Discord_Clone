import crypto from "crypto";

export const generateRandomId = (length = 8) =>
  crypto.randomBytes(length).toString("hex");

export const generateRandomNumber = () => Math.floor(Math.random() * 3) + 1;
