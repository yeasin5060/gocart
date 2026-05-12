import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//auth admin
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if(!isAdmin){
            return NextResponse.json({message : 'not authorized', status:401});
        }
        return NextResponse.json({isAdmin});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}