import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

    //add new rating
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {orderId,productId,rating,review} = await request.json();

        const order = await prisma.order.findUnique({
            where : {id : orderId , userId}
        });

        if(!order){
            return NextResponse.json({message : 'order not found'},{status:404});
        }

        const isAlreadyRated = await prisma.rating.findFirst({
            where : {productId,orderId}
        });

        if(isAlreadyRated){
            return NextResponse.json({message : 'product is already rated'},{status:400});
        }

        const response = await prisma.rating.create({
            data : {
                userId,
                productId,
                orderId,
                rating,
                review
            }
        });

        return NextResponse.json({message:'Rating added successfully', rating : response});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}

// get all rating for a user
export async function GET(request) {
    try {
        const {userId} = getAuth(request);

        if(!userId){
            return NextResponse.json({message : 'Unauthorized'},{status:401});
        }

        const ratings = await prisma.rating.findMany({
            where : {userId}
        });

        return NextResponse.json({ ratings, message : 'All Ratings get successfully'}, {status:200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}
