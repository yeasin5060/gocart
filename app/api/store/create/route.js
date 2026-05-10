import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create the store


export async function POST (request) {
    try {
        const {userId} = getAuth(request);

        // get the data from the form
        const formData = await request.formData();

        const name = formData.get('name');
        const username = formData.get('username');
        const description = formData.get('description');
        const email = formData.get('email');
        const contact = formData.get('contact');
        const address = formData.get('address');
        const image = formData.get('image');

        if(!name || !username || !description || !email || !contact || !address || !image){
            return NextResponse.json({message : 'missing store info' , status : 400})
        }

        // check is user have alredy registered a store
        const store = await prisma.store.findFirst({
            where: { userId : userId}
        });
        // if store is alredy registered than send status of store
        if(store){
            return NextResponse.json({status : store.status});
        }
        // check the username is alredy taken
        const isUsernameTaken = await prisma.store.findFirst({
            where : {username : username.toLowerCase()}
        });

        if(isUsernameTaken){
            return NextResponse.json({message : 'username alredy taken' , status : 400})
        }
    } catch (error) {
        
    }
}