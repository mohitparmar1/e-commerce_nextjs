"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

function AuthForm() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("Role");
    setRole(userRole ?? "");
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full  bg-gray-100 p-4">
      <Card className=" shadow-lg rounded-xl h-screen w-full">
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-center text-2xl font-semibold">
            <Link href="/">Welcome</Link>
          </CardTitle>
          <CardTitle className="text-center text-xl font-semibold">
            <Link href="/order-history">Order History</Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {role === "admin" ? <CreateProductForm /> : <BuyProductPage />}
        </CardContent>
      </Card>
    </div>
  );
}

function CreateProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  interface ProductFormData {
    name: string;
    price: number;
    description: string;
  }

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast({
        title: result.message,
        variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
        // Reset form after successful product creation
        const form = document.querySelector("form");
        if (form) {
          form.reset();
        }
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label>Product Name</Label>
        <Input
          type="text"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
      </div>
      <div className="mb-4">
        <Label>Price</Label>
        <Input
          type="number"
          {...register("price", { required: "Price is required" })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{String(errors.price.message)}</p>
        )}
      </div>
      <div className="mb-4">
        <Label>Description</Label>
        <Input
          type="text"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">
            {String(errors.description?.message)}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}

function BuyProductPage() {
  const [products, setProducts] = useState<Product[] | null>([]); // Initialize as null

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/get-allProduct"); // Create this API route
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error("Error fetching products:", data.message);
          setProducts(null); // Set to null in case of error
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(null); // Set to null in case of error
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Browse and Buy Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products &&
          products.map(
            (
              product // Conditional rendering
            ) => <ProductCard key={product._id} product={product} />
          )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBuy = async () => {
    setLoading(true);
    try {
      // Get the user ID from localStorage (replace with your actual user ID retrieval method)
      const userId = localStorage.getItem("urerId"); // Assuming you store userId in localStorage
      if (!userId) {
        toast({
          title: "Error",
          description: "User not logged in",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/buy-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: product._id,
        }),
      });

      const data = await response.json();

      toast({
        title: data.message,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Price: ${product.price}</p>
        <p>{product.description}</p>
        <Button onClick={handleBuy} disabled={loading}>
          {loading ? "Buying..." : "Buy"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default AuthForm;
