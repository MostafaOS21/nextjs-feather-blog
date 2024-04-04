"use client";

import { protectedRoute, refreshAuth } from "@/app/actions";
import { protectedRoutes } from "@/helpers/constants";
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
      let isProtectedRoute = false;

      protectedRoutes.forEach((route) => {
        if (pathname.includes(route)) {
          isProtectedRoute = true;
        }
      });

      if (!isAuth && isProtectedRoute) {
        dispatch(logOut());
        router.push("/sign-in");
      } else if (
        pathname.includes("/sign-in") ||
        pathname.includes("/sign-up")
      ) {
        if (isAuth) {
          router.push("/");
        }
      }
    };
    checkIsAuth();
  }, [pathname]);

  return children;
}
