import { Product } from "@/app/model/User.Model";

export async function GET(request: Request) {

    try {
        const products = await Product.find();
        if (!products) {
            return Response.json({ success: false, message: 'No product found' }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: 'All products',
            data: products
        })
    } catch (error) {
        return Response.json({
            success: true,
            message: 'Error fetching products',
            data: null
        })
    }
}