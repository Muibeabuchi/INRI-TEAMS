import { DataModel } from "./../_generated/dataModel.d";
import { Triggers } from "convex-helpers/server/triggers";

import { getManyFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { mutation as rawMutation } from "../_generated/server";

const triggers = new Triggers<DataModel>();

triggers.register("members", async (ctx, change) => {
  // grab the deletedMembers user data
  if (change.operation === "delete") {
    // Using relationships.ts helpers for succinctness.
    await asyncMap(
      await getManyFrom(
        ctx.db,
        "tasks",
        "by_assigneeId",
        change.oldDoc.userId
        // "assigneeId"
      ),
      (task) => ctx.db.delete(task._id)
    );
  }
});

export const TriggerMutation = customMutation(
  rawMutation,
  customCtx(triggers.wrapDB)
);
