import { prisma } from "@/src/db.js";
import { inngest } from "./client.js";

// ✅ inngest function to the create a user
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-create",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
        const {data} = event
        await prisma.user.create({
            data : {
                id : data.id,
                email: data?.email_addresses?.[0]?.email_address,
                name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
                image: data?.image_url,
            }
        })
  }
);
