"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [Type, setType] = useState("signin");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data, Type) => {
    setLoading(true);
    try {
      const endpoint = Type === "signin" ? "/api/sign-in" : "/api/sign-up";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        toast({ title: result.message, variant: "default" });

        if (result.role) {
          localStorage.setItem("Role", result.role);
        }

        // Redirect after successful sign-up/sign-in
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Welcome
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" onValueChange={(value) => setType(value)}>
            {" "}
            {/* Use onValueChange */}
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSubmit((data) => onSubmit(data, "signin"))}>
                {" "}
                {/* Pass type to onSubmit */}
                <div className="mb-4">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message &&
                        typeof errors.email.message === "string" && (
                          <p className="text-red-500 text-sm">
                            {errors.email.message}
                          </p>
                        )}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message &&
                        typeof errors.password.message === "string" && (
                          <p className="text-red-500 text-sm">
                            {errors.password.message}
                          </p>
                        )}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit((data) => onSubmit(data, "signup"))}>
                {" "}
                {/* Pass type to onSubmit */}
                <div className="mb-4">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message &&
                        typeof errors.username.message === "string" && (
                          <p className="text-red-500 text-sm">
                            {errors.username.message}
                          </p>
                        )}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message &&
                        typeof errors.email.message === "string" && (
                          <p className="text-red-500 text-sm">
                            {errors.email.message}
                          </p>
                        )}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message &&
                        typeof errors.password.message === "string" && (
                          <p className="text-red-500 text-sm">
                            {errors.password.message}
                          </p>
                        )}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
