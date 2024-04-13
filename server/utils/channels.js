export const initializeChannel = (name) => {
  const channel = {
    name,
    messages: [],
  };

  return channel;
};
