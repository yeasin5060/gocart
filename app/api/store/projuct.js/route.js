import imagekit from "@/configs/imagekit";
import authSeller from "@/middlewares/authSeller";
import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// add new product
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({message : 'not authorized'},{status:401})
        }

         // get the data from the form
        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const mrp = Number(formData.get('mrp'));
        const price = Number(formData.get('price'));
        const category = formData.get('category');
        const images = formData.getAll('images');

        if(!name || !username || !description || !mrp || !price || !category || !images.length < 1){
            return NextResponse.json({message : 'missing product details'},{  status : 400})
        }

        // image upload to imagekit
        const imageUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file : buffer,
                fileName : image.name,
                folder : 'products'
            });
            const url = imagekit.url({
                path : response.filePath,
                transformation : [
                    {quality : 'auto'},
                    {format : 'webp'},
                    {with : '1024'}
                ]
            });
            return url
        }));
        
        await prisma.product.create({
            data : {
                name,
                description,
                mrp,
                price,
                category,
                images : imageUrl,
                storeId
            }
        });

        return NextResponse.json({message : 'product added successfully'});

    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}

// get all product for a seller
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({message : 'not authorized'},{status:401});
        }

        const products = await prisma.product.findMany({
            where : {storeId}
        });
        
        return NextResponse.json({message : 'product get successfully' , products});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}