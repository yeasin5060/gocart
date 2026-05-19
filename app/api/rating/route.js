import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


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