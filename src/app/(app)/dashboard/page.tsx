"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function AuthForm() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("Role");
    setRole(userRole ?? "");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Welcome
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

  const onSubmit = async (data) => {
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
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Browse and Buy Products</h2>
      <p className="text-gray-600">Product list goes here...</p>
    </div>
  );
}

export default AuthForm;
