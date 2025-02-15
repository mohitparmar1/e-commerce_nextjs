import dbConnect from "@/app/utils/dbConnect";
import { Product } from "@/app/model/User.Model";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  await dbConnect();

  const form = new formidable.IncomingForm();

  form.parse(request, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data", err);
      return Response.json(
        {
          success: false,
          message: "Error parsing form data",
        },
        {
          status: 500,
        }
      );
    }

    const { name, price, description } = fields;
    const file = files.image;

    if (!name || !price || !description || !file) {
      return Response.json(
        {
          success: false,
          message: "Please fill all fields and upload an image",
        },
        {
          status: 400,
        }
      );
    }

    try {
      const fileContent = fs.readFileSync(file.path);
      const result = await cloudinary.uploader.upload(fileContent, {
        folder: "products",
      });

      const newProduct = new Product({
        name,
        price,
        description,
        imageUrl: result.secure_url,
      });

      await newProduct.save();

      return Response.json(
        {
          success: true,
          message: "Product created successfully",
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error("Error creating product", error);
      return Response.json(
        {
          success: false,
          message: "Error creating product",
        },
        {
          status: 500,
        }
      );
    }
  });
}