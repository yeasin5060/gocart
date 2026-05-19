import { prisma } from "@/src/db";
import { NextResponse } from "next/server";

//get store info & store products
export async function GET(request) {
    try {
        //get store username from query params
        const {searchParams} = new URL(request.url);
        const username = searchParams.get('username').toLowerCase();
        
        if(!username){
            return NextResponse.json({message : 'missing username'},{status:401});
        }
        // get store info and instock products with rating
        const store = await prisma.store.findUnique({
            where: {
                username,
                isActive: true
            },
            include: {
                Product: {
                    include: {
                        rating: true
                    }
                }
            }
        });

        if(!store){
            return NextResponse.json({message : 'store not found'},{status:401});
        }

        return NextResponse.json({store});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}