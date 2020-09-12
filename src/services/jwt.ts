export const TOKEN_KEY = "token";

export const getToken = (): string | null => {
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (!token || typeof token !== "string") return;

  window.localStorage.setItem(TOKEN_KEY, token);
};

export const deleteToken = () => {
  window.localStorage.removeItem(TOKEN_KEY);
};

export default { TOKEN_KEY, getToken, setToken, deleteToken };
