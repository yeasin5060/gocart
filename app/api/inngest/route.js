import { serve } from "inngest/next";
import { syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/inngest/function";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});