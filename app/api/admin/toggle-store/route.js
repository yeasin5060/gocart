import authAdmin from "@/middlewares/authAdmin";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// toggle stores isActive
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if(!isAdmin){
            return NextResponse.json({message : 'not authorized'},{status:401});
        }
        
        const {storeId} = await request.json();
        if(!storeId){
            return NextResponse.json({message : 'missing storeId'},{status:401});
        }

        // find the store
        const store = await prisma.store.findUnique({
            where : {id : storeId}
        });

        if(!store){
            return NextResponse.json({message : 'store not found'},{status:401});
        }

        await prisma.store.update({
            where : {id : storeId},
            data : {isActive : !store.isActive}
        });
        return NextResponse.json({message : 'store toggle updated successfully'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}