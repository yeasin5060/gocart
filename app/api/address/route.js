import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//add new address
export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const {address} = await request.json();

        address.userId = userId;

        const newAddress = await prisma.address.create({
            data : address
        });

        return NextResponse.json({ newAddress,message : 'address added successfully', status : 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}