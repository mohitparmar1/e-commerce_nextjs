import dbConnect from "@/app/utils/dbConnect";
import { Product } from "@/app/model/User.Model";

export async function GET() {
    await dbConnect();

    try {
        const products = await Product.find({});
        return Response.json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Error fetching products", error);
        return Response.json({
            success: false,
            message: "Error fetching products",
        }, {
            status: 500,
        });
    }
}