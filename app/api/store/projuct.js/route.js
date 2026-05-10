import { getAuth } from "@clerk/nextjs/server";

// add new product
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({message : error.message},{status:400});
    }
}