export const parseCookies = (arr: string[]) => {
  const cookies: Record<string, string> = {};

  arr.forEach((cookie) => {
    const [key, value] = cookie.split("=");

    cookies[key] = value;
  });

  return cookies;
};
