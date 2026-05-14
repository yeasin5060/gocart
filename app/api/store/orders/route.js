import authSeller from "@/middlewares/authSeller";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

    // update seller orders status
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({message : 'store not found'},{status:401});
        }

        const {orderId , status} = await request.json();

        await prisma.order.update({
            where : {id:orderId , storeId},
            data : {status}
        })

        return NextResponse.json({message : 'order status updated'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}

// get all order for a seller
