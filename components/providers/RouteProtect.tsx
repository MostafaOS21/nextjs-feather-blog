"use client";

import { refreshAuth } from "@/app/actions";
import { logOut } from "@/lib/features/auth/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function RouteProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsAuth = async () => {
      const { isAuth } = await refreshAuth();

      if (!isAuth) {
        dispatch(logOut());
        router.push("/sign-in");
      } else if (
        pathname.includes("/sign-in") ||
        pathname.includes("/sign-up")
      ) {
        router.push("/");
      }
    };
    checkIsAuth();
  }, [pathname]);

  return children;
}
