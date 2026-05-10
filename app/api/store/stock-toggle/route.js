import authSeller from "@/middlewares/authSeller";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// toggle stock of a product
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {productId} = await request.json();

        if(!productId){
            return NextResponse.json({message : 'missing details: productId'},{status:400});
        }
        
        const storeId = await authSeller(userId);
        if(!storeId){
            return NextResponse.json({message : 'not authorized'},{status:401});
        }

        // check if product exists
        const product = await prisma.product.findFirst({
            where : {id : productId,storeId}
        });

        if(!product){
            return NextResponse.json({message : 'no found product'},{status:404});
        }
        
        await prisma.product.update({
            where : {id : productId},
            data : {inStock : !product.inStock}
        });

        return NextResponse.json({message : 'product stock update successfully'},{status:200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}