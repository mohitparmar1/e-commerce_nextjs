import dbConnect from "@/app/utils/dbConnect";
import { User } from "@/app/model/User.Model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password, role } = await request.json();

        if (!username || !email || !password) {
            return Response.json({
                success: false,
                message: "Please fill all fields"
            }, {
                status: 400
            });
        }

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return Response.json({
                success: false,
                message: "Email already exists"
            }, {
                status: 400
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });
        await newUser.save();

        return Response.json({
            success: true,
            message: "User created successfully",
            role: newUser.role
        }, {
            status: 201
        });
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        });
    }
}