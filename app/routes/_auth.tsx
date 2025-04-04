import { fetchClerkAuth } from "@/utils/auth";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatch,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async (ctx) => {
    const auth = await fetchClerkAuth();
    const { userId, token } = auth;

    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    if (userId) {
      throw redirect({
        to: "/",
      });
    }

    // return {
    //   userId,
    //   token,
    // };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const signInPageMatch = useMatch({
    from: "/_auth/sign-in/$",
    shouldThrow: false,
  });
  const signUpPageMatch = useMatch({
    from: "/_auth/sign-up/$",
    shouldThrow: false,
  });
  return (
    <main className="bg-neutral-100 min-h-screen w-full">
      <div className="mx-auto max-w-screen-2xl p-4 h-full">
        <nav className="flex justify-between items-center ">
          <img src="/logo.svg" alt="logo" width={50} height={50} />
          <>
            {signInPageMatch && (
              <Link to="/sign-up/$" className="font-semibold">
                Sign Up
              </Link>
            )}
            {signUpPageMatch && (
              <Link to="/sign-in/$" className="font-semibold  ">
                Sign In
              </Link>
            )}
          </>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-10">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
