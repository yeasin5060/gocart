import { serve } from "inngest/next";
import { syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/inngest/function";
import { inngest } from "../../../inngest/client";




export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});