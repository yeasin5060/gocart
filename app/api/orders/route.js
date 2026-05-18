import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const {userId , has} = getAuth(request);
        if(!userId) {
            return NextResponse.json({message : 'not authorized'},{status : 401});
        }

        const {addressId, items,couponCode,paymentMethod} = await request.json();

        //check if all required fields are present
        if(!addressId || !paymentMethod || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({message : 'missing order details'},{status : 401});
        }

        let coupon = null;
        
        if(couponCode){
            coupon = await prisma.coupon.findUnique({
                where : {code : couponCode},
            });

            if(!coupon){
                return NextResponse.json({message : 'Coupon not fount'},{status : 404});
            }
        
        }

        if(couponCode && coupon.forNewUser){
            const userOrders = await prisma.order.findMany({
                where : {userId}
            });

            if(userOrders.length > 0){
                return NextResponse.json({message : 'Coupon vailid for new user'},{status : 400});
            }
        }

        const isPlusMember = has({plan:'plus'});

        if(couponCode && coupon.forMember){
            if(!isPlusMember){
                return NextResponse.json({message : 'Coupon vailid for member only'},{status : 400});
            }
        }

        //group orders by storeId useing a map
        const ordersByStore = new Map();

        for(const item of items){
            const product = await prisma.product.findUnique({where : {id : item.id}});
            const storeId = product.storeId

            if(!ordersByStore.has(storeId)){
                ordersByStore.set(storeId, []);
            }
            ordersByStore.get(storeId).push({...item,price:product.price});
        }

        let orderIds = [];
        let fullAmount = 0;
        let isShippingAdded = false;

        //create orders for each seller
        for(const[storeId, sellerItems] of ordersByStore.entries()){
            let total = sellerItems.reduce((acc , item) => acc + (item.price * item.quantity),0);
            if(couponCode){
                total -= (total * coupon.discount) / 100;
            }
            
            if(!isPlusMember && !isShippingAdded){
                total += 5
                isShippingAdded = true
            }

            fullAmount += parseFloat(total.toFixed(2));

            const order = await prisma.order.create({
                data : {
                    userId,
                    storeId,
                    addressId,
                    total : parseFloat(total.toFixed(2)),
                    paymentMethod,
                    isCouponUsed : coupon ? true : false,
                    coupon : coupon ? coupon : {},
                    orderItems : {
                        create : sellerItems.map((item) => ({
                            productId : item.id,
                            quantity : item.quantity,
                            price : item.price
                        }))     
                    }
                }
            });
            orderIds.push(order.id);
        }

        // clear the cart
        await prisma.user.update({
            where : {id : userId},
            data : {cart : {}}
        });

        return NextResponse.json({message : 'order create successfully'});
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}