import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
  HeadContent,
  Scripts,
  useRouteContext,
  // redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import type { QueryClient } from "@tanstack/react-query";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { IconLink } from "@/components/IconLink";
import { NotFound } from "@/components/NotFound";
import { seo } from "@/utils/seo";
import appCss from "@/styles/app.css?url";
import { Loader } from "@/components/Loader";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";
import { Button } from "@/components/ui/button";
// import { getWebRequest } from "vinxi/http";

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();

  const sk = import.meta.env.CLERK_SECRET_KEY;
  const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  console.log(sk);
  console.log(pk);
  if (!request) throw new Error("No request found");
  const auth = await getAuth(request, {
    secretKey: sk,
  });

  // if (!auth.userId) {
  //   // This will error because you're redirecting to a path that doesn't exist yet
  //   // You can create a sign-in route to handle this
  //   // See https://clerk.com/docs/references/tanstack-start/custom-sign-in-or-up-page
  //   throw redirect({
  //     to: "/sign-in/$",
  //   });
  // }
  const token = await auth.getToken({ template: "convex" });

  return {
    userId: auth.userId,
    token,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  // beforeLoad: async (ctx) => {
  //   const auth = await fetchClerkAuth();
  //   const { userId, token } = auth;

  //   // During SSR only (the only time serverHttpClient exists),
  //   // set the Clerk auth token to make HTTP queries with.
  //   if (token) {
  //     ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
  //   }

  //   return {
  //     userId,
  //     token,
  //   };
  // },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  // const routerContext = Route.useRouteContext()

  const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={pk!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={context.convexClient}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="h-screen flex flex-col min-h-0">
          <div className="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border">
            <div className="flex items-center gap-4">
              <div>
                <Link to="/" className="block leading-tight">
                  <div className="font-black text-2xl text-white">Trellaux</div>
                  <div className="text-slate-500">a TanStack Demo</div>
                </Link>
              </div>
              <LoadingIndicator />
            </div>
            <div className="flex items-center gap-6">
              {/* <label
                htmlFor="countries"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Delay
              </label>
              <select
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(event) => {
                  // setExtraDelay(Number(event.currentTarget.value))
                }}
                defaultValue="0"
              >
                <option value="0">None</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="2000">2000</option>
              </select> */}
              <IconLink
                href="https://github.com/TanStack/router/tree/main/examples/react/start-trellaux"
                label="Source"
                icon="/github-mark-white.png"
              />
              <IconLink
                href="https://tanstack.com"
                icon="/tanstack.png"
                label="TanStack"
              />

              <Unauthenticated>
                <div className="flex items-center justify-center gap-4">
                  <SignInButton>
                    <Button variant={"outline"}>Sign In</Button>
                  </SignInButton>

                  <SignUpButton>
                    <Button>Register</Button>
                  </SignUpButton>
                </div>
              </Unauthenticated>
            </div>
          </div>

          <div className="flex-grow min-h-0 h-full flex flex-col">
            {children}
            <Toaster />
          </div>
        </div>
        <ReactQueryDevtools position="bottom" />
        <TanStackRouterDevtools position="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}

function LoadingIndicator() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  return (
    <div
      className={`h-12 transition-all duration-300 ${
        isLoading ? `opacity-100 delay-300` : `opacity-0 delay-0`
      }`}
    >
      <Loader />
    </div>
  );
}
