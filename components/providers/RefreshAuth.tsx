"use client";
import { useEffect } from "react";
import { logIn, logOut } from "@/lib/features/auth/authSlice";
import { refreshAuth, signOut } from "@/app/actions";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";

export default function RefreshAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let opacityTimeout: NodeJS.Timeout, removeTimeout: NodeJS.Timeout;

    refreshAuth()
      .then((res) => {
        if (res.isAuth) {
          dispatch(logIn(res.user));
        } else {
          throw new Error("Not authenticated");
        }
      })
      .catch(() => {
        dispatch(logOut());
        signOut().then();
      })
      .finally(() => {
        opacityTimeout = setTimeout(() => {
          const loader = document.getElementById("loader");
          if (loader) {
            loader.classList.add("opacity-0");

            // Remove the loader
            removeTimeout = setTimeout(() => {
              loader.classList.add("hidden");
            }, 400);
          }
        }, 500);
      });

    let REFRESH_INTERVAL = 600000;

    if (process.env.NEXT_PUBLIC_REFRESH_INTERVAL) {
      REFRESH_INTERVAL = +parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL);
    }

    // Throttle the refresh interval
    const refreshInterval = setInterval(() => {
      refreshAuth()
        .then((res) => {
          if (res.isAuth) {
            dispatch(logIn(res.user));
          } else {
            throw new Error("Not authenticated");
          }
        })
        .catch(() => {
          toast("Session has expired");
          dispatch(logOut());
          signOut().then();

          window.location.href = "/sign-in";
        });
    }, REFRESH_INTERVAL);

    let mustRemoveTimeOut = setTimeout(() => {
      const loader = document.getElementById("loader");

      loader?.classList.add("hidden");

      console.log("MUST REMOVE");
    }, 6000);

    return () => {
      clearTimeout(opacityTimeout);
      clearTimeout(removeTimeout);
      clearTimeout(mustRemoveTimeOut);
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <>
      <span
        id="loader"
        className="fixed left-0 top-0 w-screen h-screen bg-white z-[999999999] grid place-items-center transition-opacity delay-300"
      >
        <span className="loader"></span>
      </span>
      {children}
    </>
  );
}
