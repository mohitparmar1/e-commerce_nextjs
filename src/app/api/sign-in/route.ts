import dbConnect from "@/app/utils/dbConnect";
import { User } from "@/app/model/User.Model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect()

    const { email, password } = await request.json();

    const isUser: { _id: string; email: string; password: string; role: string } | null = await User.findOne({ email })

    if (!isUser) {
        return Response.json({
            success: false,
            message: 'User not found'
        }, {
            status: 401
        })
    }
    if (isUser) {
        try {
            if (isUser.email == email && (await bcrypt.compare(password, isUser.password))) {
                return Response.json({
                    success: true,
                    message: 'Successfully Login',
                    userId: isUser._id.toString(),
                    role: isUser.role
                }, {
                    status: 200
                })
            }
            return Response.json({
                success: false,
                message: 'Invalid Credentials'
            }, {
                status: 401
            })
        } catch (error) {
            console.error("Error occured while signin")
            return Response.json({
                success: false,
                message: 'Error occured whiel signin'
            }, {
                status: 501
            })
        }
    }
}