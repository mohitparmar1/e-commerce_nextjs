// filepath: /D:/e-commerce_nextjs/src/app/api/buy-product/route.ts
import dbConnect from "@/app/utils/dbConnect";
import { Purchase } from "@/app/model/User.Model";
import { Product } from "@/app/model/User.Model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { userId, productId } = await request.json();

        if (!userId || !productId) {
            return Response.json({
                success: false,
                message: "Missing userId or productId"
            }, {
                status: 400
            });
        }

        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return Response.json({
                success: false,
                message: "Product not found"
            }, {
                status: 404
            });
        }

        const newPurchase = new Purchase({
            userId,
            productId,
            productName: product.name,
            productPrice: product.price,
            productDescription: product.description,
            purchaseDate: new Date()
        });

        await newPurchase.save();

        return Response.json({
            success: true,
            message: "Product purchased successfully"
        }, {
            status: 201
        });

    } catch (error) {
        console.error("Error creating purchase", error);
        return Response.json({
            success: false,
            message: "Error creating purchase"
        }, {
            status: 500
        });
    }
}