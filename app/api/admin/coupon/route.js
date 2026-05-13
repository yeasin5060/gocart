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

//deleted coupon / api/coupon?id = couponId
export async function DELETE(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if(!isAdmin){
            return NextResponse.json({message : 'not authorized', status:401});
        }

        const {searchParams} =  request.nextUrl;
        const code = searchParams.get('code');

        await prisma.coupon.delete({where: {code}});
       
        return NextResponse.json({message : 'coupon deleted successfully'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}

//get all coupon
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if(!isAdmin){
            return NextResponse.json({message : 'not authorized', status:401});
        }

        const coupon = await prisma.coupon.findMany({});

        return NextResponse.json({message : 'coupon get successfully' , coupon});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}

