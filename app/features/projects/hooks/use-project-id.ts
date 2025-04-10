import { useParams, useRouterState } from "@tanstack/react-router";

export function useProjectId() {
  const params = useParams({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId",
    shouldThrow: false,
  });
  const params1 = useParams({
    from: "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/projects/$projectId/settings",
    shouldThrow: false,
  });

  const projectId = (params?.projectId || params1?.projectId) ?? null;

  if (!projectId) throw new Error("projectId does not exist");

  return projectId;
}
