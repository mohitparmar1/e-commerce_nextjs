import dbConnect from "@/app/utils/dbConnect";
import { Product } from "@/app/model/User.Model";

export async function POST(request: Request) {
    await dbConnect();
    const { name, price, description } = await request.json();
    try {
        if (!name || !price || !description) {
            return Response.json({
                success: false,
                message: "Please fill all fields"
            }, {
                status: 400
            });
        }

        const newProduct = new Product({
            name,
            price,
            description
        });
        await newProduct.save();

        return Response.json({
            success: true,
            message: "Product created successfully",
        }, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating product", error);
        return Response.json({
            success: false,
            message: "Error creating product"
        }, {
            status: 500
        });
    }
}