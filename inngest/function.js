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

// ✅ inngest function to the Update user

export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-update",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const {data} = event;

    await prisma.user.update({
        where : {id : data.id},
        data : {
            email:data?.email_addresses[0].email_address,
            name:data?.first_name + " " +data?.last_name,
            imageUrl:data?.image_url,
        }
    })
  }
);

// ✅ inngest function to the Delete user

export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-delete",
    triggers: [{ event: "clerk/user.deleted" }],
  },

  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
        where : {id : data.id}
    })
    
  }
);
