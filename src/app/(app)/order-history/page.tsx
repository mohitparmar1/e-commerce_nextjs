"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Purchase {
  _id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productDescription: string;
  purchaseDate: string;
}

function OrderHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { toast } = useToast();
  const router = useRouter(); // Use next/navigation

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const userId = localStorage.getItem("urerId");
        if (!userId) {
          toast({
            title: "Error",
            description: "User not logged in",
            variant: "destructive",
          });
          router.push("/sign-up");
          return;
        }

        const response = await fetch(
          `/api/get-purchase-history?userId=${userId}`
        );
        const data = await response.json();

        if (data.success) {
          setPurchases(data.purchases);
        } else {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        toast({
          title: "Error",
          description: "Something went wrong!",
          variant: "destructive",
        });
      }
    };

    fetchPurchaseHistory();
  }, [router, toast]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-center">No purchases found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {purchase.productName}
                    </h3>
                    <p className="text-gray-700">
                      Price: ${purchase.productPrice}
                    </p>
                    <p className="text-gray-600">
                      {purchase.productDescription}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Purchased on:{" "}
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderHistoryPage;
