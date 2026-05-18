import { prisma } from "@/src/db";
import { getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// verify coupon
export async function POST(request) {
    try {
        const {userId,has} = getAuth(request);
        const {code} = await request.json();

        const coupon = await prisma.coupon.findUnique({
            where : {code : code.toUpperCase(),
                expiresAt : {gt : new Date()}
            },
        });

        if(!coupon){
            return NextResponse.json({message : 'Coupon not fount'},{status : 404});
        }

        if(coupon.forNewUser){
            const userOrders = await prisma.order.findMany({
                where : {userId}
            });

            if(userOrders.length > 0){
                return NextResponse.json({message : 'Coupon vailid for new user'},{status : 400});
            }
        }

        if(coupon.forMember){
            const hasPlanPlus = has({plan:'plus'});
            if(!hasPlanPlus){
                return NextResponse.json({message : 'Coupon vailid for member only'},{status : 400});
            }
        }

        return NextResponse.json({coupon});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}