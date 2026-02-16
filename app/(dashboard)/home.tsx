import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { auth } from "../../services/firebase";
import { getProducts } from "../../services/productService";

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export default function Home() {
    const [displayName, setDisplayName] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    // Fetch products when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [])
    );

    useEffect(() => {
        if (auth.currentUser?.email) {
            setDisplayName(auth.currentUser.email.split("@")[0]);
        }
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);

            // Calculate totals
            setTotalProducts(fetchedProducts.length);

            const value = fetchedProducts.reduce((sum, product) => {
                return sum + (product.price * product.quantity);
            }, 0);
            setTotalValue(value);

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const formatLKR = (value: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value).replace('LKR', 'Rs.');
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-blue-600 px-6 py-8 pt-12">
                <Text className="text-white text-3xl font-bold">Dashboard</Text>
                <Text className="text-blue-100 text-base mt-1">Welcome back, {displayName}!</Text>
            </View>

            {/* Main Content - Using ScrollView */}
            <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
                {/* Stats cards - Reduced gap between cards */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-gradient-to-r from-blue-50 to-blue-100 flex-1 rounded-xl p-4 mr-2">
                        <Text className="text-gray-600 text-sm">Total Products</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color="#3B82F6" className="mt-2" />
                        ) : (
                            <Text className="text-blue-600 text-3xl font-bold mt-2">{totalProducts}</Text>
                        )}
                    </View>
                    <View className="bg-gradient-to-r from-green-50 to-green-100 flex-1 rounded-xl p-4 ml-2">
                        <Text className="text-gray-600 text-sm">Total Value</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color="#10B981" className="mt-2" />
                        ) : (
                            <Text className="text-green-600 text-3xl font-bold mt-2">
                                {formatLKR(totalValue)}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Recent Products Preview */}
                {!loading && products.length > 0 && (
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-gray-700 font-semibold text-lg">Recent Products</Text>
                            <Pressable 
                                onPress={() => router.push("/(dashboard)/products")}
                                className="bg-blue-100 px-4 py-2 rounded-full"
                            >
                                <Text className="text-blue-600 font-semibold">View All</Text>
                            </Pressable>
                        </View>

                        {products.slice(0, 3).map((product) => (
                            <Pressable 
                                key={product.id} 
                                className="bg-gray-50 rounded-lg p-3 mb-2 flex-row justify-between items-center"
                                onPress={() => router.push({
                                    pathname: "/(dashboard)/products/edit/[id]",
                                    params: { id: product.id }
                                })}
                            >
                                <View className="flex-1 mr-2">
                                    <Text className="font-semibold text-gray-800">{product.name}</Text>
                                    <Text className="text-sm text-gray-600">
                                        Qty: {product.quantity} | Price: {formatLKR(product.price)}
                                    </Text>
                                </View>
                                <Text className="font-bold text-blue-600">
                                    {formatLKR(product.price * product.quantity)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <View className="mb-6 p-8 items-center">
                        <Text className="text-gray-400 text-6xl mb-4">📦</Text>
                        <Text className="text-gray-600 text-lg text-center">No products yet</Text>
                        <Text className="text-gray-400 text-sm text-center mt-2">Add your first product to get started</Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold text-lg mb-3">Quick Actions</Text>

                    <Pressable
                        className="bg-blue-600 rounded-xl p-5 mb-3 flex-row items-center"
                        onPress={() => router.push("/(dashboard)/products")}
                    >
                        <View className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                            <Text className="text-white text-2xl">📦</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Manage Products</Text>
                            <Text className="text-blue-100 text-sm">View and edit your products</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        className="bg-green-600 rounded-xl p-5 mb-3 flex-row items-center"
                        onPress={() => router.push("/(dashboard)/products/add")}
                    >
                        <View className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                            <Text className="text-white text-2xl">➕</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Add Product</Text>
                            <Text className="text-green-100 text-sm">Create a new product</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        className="bg-purple-600 rounded-xl p-5 flex-row items-center"
                        onPress={() => {}}
                    >
                        <View className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                            <Text className="text-white text-2xl">👤</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Profile</Text>
                            <Text className="text-purple-100 text-sm">Coming soon...</Text>
                        </View>
                    </Pressable>
                </View>

                {/* Sign Out Button */}
                <View className="mt-4 mb-8">
                    <TouchableOpacity
                        onPress={handleSignOut}
                        className="bg-red-600 rounded-xl p-4 flex-row justify-center items-center"
                    >
                        <Text className="text-white text-center font-bold text-base">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}