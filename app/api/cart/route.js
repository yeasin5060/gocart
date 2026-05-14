import { prisma } from "@/src/db";
import { NextResponse } from "next/server";

//update user cart
export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const {cart} = await request.json();

        await prisma.user.update({
            where : {id : userId},
            data : {cart : cart}
        });
        return NextResponse.json({message : 'cart updated' ,status : 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}
