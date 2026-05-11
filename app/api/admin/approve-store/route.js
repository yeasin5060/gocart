import authAdmin from "@/middlewares/authAdmin";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//approve seller
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if(!isAdmin){
            return NextResponse.json({message : 'not authorized'},{status:401});
        }
        
        const {storeId , status} = await request.json();

        if(status === 'approve'){
            await prisma.store.update({
                where : {id: storeId},
                data : {status : "approve", isActive: true}
            });
        }else if(status === 'rejected'){
            await prisma.store.update({
                where : {id: storeId},
                data : {status : "rejected"}
            });
        }
        return NextResponse.json({message : status + 'successfully'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}

// get all pending and rejected store
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if(!isAdmin){
            return NextResponse.json({message : 'not authorized'},{status:401});
        }
        
        const stores = await prisma.store.findMany({
            where : {status : {in : ['pending' , 'rejected']}},
            include : {user : true}
        });
        return NextResponse.json({stores});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}