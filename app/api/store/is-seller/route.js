import authSeller from "@/middlewares/authSeller";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// auth seller
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const isSeller = await authSeller(userId);

        if(!isSeller){
            return NextResponse.json({message : 'not authorized'},{status:401});
        }

        const storeInfo = await prisma.store.findUnique({
            where : {userId}
        });

        return NextResponse.json({isSeller , storeInfo});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}