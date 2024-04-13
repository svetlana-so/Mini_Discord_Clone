import { generateRandomId } from "./utils.js";

const buildMessage = (session, message) => {
  return {
    id: generateRandomId(),
    userId: session.userId,
    username: session.username,
    message,
  };
};

export { buildMessage };
