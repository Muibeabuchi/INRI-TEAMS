import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { convexQuery } from "@convex-dev/react-query";
import { Outlet } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/_dashboard")({
  component: DashboardLayout,
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(
      convexQuery(api.workspaces.getUserWorkspaces, {})
    );
  },
});

function DashboardLayout() {
  return (
    <div className="min-h-screen w-full">
      <CreateWorkspaceModal />
      {/* <CreateProjectModal /> */}
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl w-full h-full">
            <Navbar />
            <main className="h-full w-full py-8 px-6 flex flex-col">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
