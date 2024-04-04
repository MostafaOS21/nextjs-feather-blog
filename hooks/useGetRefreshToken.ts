"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default function useGetRefreshToken() {
  const accessToken = cookies().get("access-token");
  let isAuth = false;
  let user;

  if (accessToken?.value) {
    const token = accessToken.value.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
      if (err) {
        isAuth = false;
      } else {
        isAuth = true;

        user = data;
        // @ts-ignore
        cookies().set("user_id", data?.id, {
          maxAge: +(process.env.COOKIE_EXPIRE || 7200),
        });
      }
    });
  } else isAuth = false;

  return {
    isAuth,
    user,
  };
}
