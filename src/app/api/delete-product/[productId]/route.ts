
import dbConnect from "@/app/utils/dbConnect";
import { Product } from "@/app/model/User.Model";
import mongoose from "mongoose";

export async function DELETE(
    request: Request,
    { params }: { params: { productId: string } }
) {
    await dbConnect();
    try {
        const { productId } = params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error("Invalid product ID format:", productId);
            return Response.json(
                {
                    success: false,
                    message: "Invalid product ID format",
                },
                {
                    status: 400,
                }
            );
        }


        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return Response.json(
                {
                    success: false,
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Product deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error deleting product:", error);
        return Response.json(
            {
                success: false,
                message: "Error deleting product",
            },
            {
                status: 500,
            }
        );
    }
}