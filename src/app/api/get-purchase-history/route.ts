import dbConnect from "@/app/utils/dbConnect";
import { Purchase } from "@/app/model/User.Model";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return Response.json({
                success: false,
                message: "Missing userId"
            }, {
                status: 400
            });
        }

        const purchases = await Purchase.find({ userId });

        return Response.json({
            success: true,
            purchases
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error fetching purchase history", error);
        return Response.json({
            success: false,
            message: "Error fetching purchase history"
        }, {
            status: 500
        });
    }
}