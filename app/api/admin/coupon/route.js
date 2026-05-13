import authAdmin from "@/middlewares/authAdmin";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//add new coupon
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if(!isAdmin){
            return NextResponse.json({message : 'not authorized', status:401});
        }

        const {coupon} = await request.json();
        coupon.code = coupon.code.toUpperCase();

        await prisma.coupon.create({
            data : coupon
        });

        return NextResponse.json({message : 'coupon added successfully'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}