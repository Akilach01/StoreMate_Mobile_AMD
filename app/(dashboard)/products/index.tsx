import { deleteProduct, getProducts } from "@/services/productService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text, Image, Alert, ActivityIndicator } from "react-native"; // CHANGED: Added Alert and ActivityIndicator

export default function productList() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); //  Added loading state
    const [deletingId, setDeletingId] = useState<string | null>(null); //  Track which item is being deleted

    const loadproducts = async () => {
        setLoading(true); //  Set loading true
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
            Alert.alert("Error", "Failed to load products");
        } finally {
            setLoading(false); //  Set loading false
        }
    };

    useEffect(() => {
        loadproducts();
    }, []);

    //  Handle delete with confirmation
    const handleDelete = async (id: string) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeletingId(id);
                        try {
                            await deleteProduct(id);
                            await loadproducts();
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            Alert.alert("Error", "Failed to delete product");
                        } finally {
                            setDeletingId(null);
                        }
                    }
                }
            ]
        );
    };

    // Format currency
    const formatLKR = (value: number) => {
        return `Rs. ${value.toFixed(2)}`;
    };

    // Empty list component
    const EmptyList = () => (
        <View className="items-center justify-center py-10">
            <Text className="text-6xl text-gray-300 mb-4">📦</Text>
            <Text className="text-gray-500 text-lg">No products yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Tap "Add New Product" to get started</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {/* Header with back button - NEW */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Text className="text-2xl text-gray-600">←</Text>
                </Pressable>
                <Text className="flex-1 text-2xl font-bold text-gray-800 text-center mr-8">Products</Text>
            </View>

            <View className="flex-1 px-4 pt-4">
                {/* Add Product Button - IMPROVED styling */}
                <Pressable
                    className="bg-blue-600 rounded-xl p-4 mb-4 flex-row justify-center items-center shadow-sm"
                    onPress={() => router.push("/(dashboard)/products/add")}
                >
                    <Text className="text-white text-lg mr-2">➕</Text>
                    <Text className="text-white font-semibold text-base">Add New Product</Text>
                </Pressable>

                {/* Loading Indicator  */}
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text className="text-gray-500 mt-4">Loading products...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={EmptyList} //  Show empty state
                        renderItem={({ item }) => (
                            <View className="bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden">
                                {/* Product Image */}
                                {item.imageUrl ? (
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        className="w-full h-48"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    // Placeholder when no image
                                    <View className="w-full h-48 bg-gray-100 items-center justify-center">
                                        <Text className="text-4xl text-gray-400">📷</Text>
                                        <Text className="text-gray-400 mt-2">No image</Text>
                                    </View>
                                )}

                                {/* Product Details */}
                                <View className="p-4">
                                    <Text className="text-xl font-bold text-gray-800 mb-2">{item.name}</Text>
                                    
                                    <View className="flex-row mb-3">
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm">Price</Text>
                                            <Text className="text-lg font-semibold text-green-600">
                                                {formatLKR(item.price)}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm">Quantity</Text>
                                            <Text className="text-lg font-semibold text-blue-600">
                                                {item.quantity} units
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm">Total Value</Text>
                                            <Text className="text-lg font-semibold text-purple-600">
                                                {formatLKR(item.price * item.quantity)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Action Buttons - IMPROVED: Small buttons */}
                                    <View className="flex-row justify-end space-x-2 gap-2">
                                        {/* Edit Button - Small */}
                                        <Pressable
                                            onPress={() => router.push(`/(dashboard)/products/edit/${item.id}`)}
                                            className="bg-blue-50 px-4 py-2 rounded-lg flex-row items-center"
                                        >
                                            <Text className="text-blue-600 mr-1">✏️</Text>
                                            <Text className="text-blue-600 font-medium">Edit</Text>
                                        </Pressable>

                                        {/* Delete Button - Small */}
                                        <Pressable
                                            onPress={() => handleDelete(item.id)}
                                            disabled={deletingId === item.id}
                                            className={`px-4 py-2 rounded-lg flex-row items-center ${
                                                deletingId === item.id ? 'bg-red-100' : 'bg-red-50'
                                            }`}
                                        >
                                            {deletingId === item.id ? (
                                                <>
                                                    <ActivityIndicator size="small" color="#EF4444" />
                                                    <Text className="text-red-600 ml-1 font-medium">...</Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text className="text-red-600 mr-1">🗑️</Text>
                                                    <Text className="text-red-600 font-medium">Delete</Text>
                                                </>
                                            )}
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}