import { getProducts, updateProduct } from "@/services/productService";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { uploadToCloudinary } from "@/services/cloudinary";
import * as ImagePicker from "expo-image-picker";



export default function EditProduct(){
    const{id} = useLocalSearchParams();
    const [name, setName] = useState("");
     const [price, setPrice] = useState("");
     const [quantity, setQuantity] = useState("");
     const [imageUri, setImageUri] = useState<string | null>(null);
     const[existingImageUrl, setExistingImageUrl] =useState("");
     const[loading, setLoading] = useState(false);
     const [updating, setUpdating] = useState(false);

      useEffect(() => {
        const load = async () => {
            setLoading(true); 
            try {
                const products = await getProducts();
                const product = products.find((p) => p.id === id);
                if (product) {
                    setName(product.name);
                    setPrice(String(product.price));
                    setQuantity(String(product.quantity));
                    setExistingImageUrl(product.imageUrl || "");
                }
            } catch (error) {
                console.error("Error loading product:", error);
                alert("Failed to load product");
            } finally {
                setLoading(false); // NEW: Set loading false
            }
        };
        load();
    }, [id]);

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

 const handleUpdate = async () => {
        if (!name.trim() || !price.trim() || !quantity.trim()) {
            alert("Please fill all fields");
            return;
        }

        setUpdating(true);
         try {
            let imageUrl = existingImageUrl;

            if (imageUri) {
                imageUrl = await uploadToCloudinary(imageUri);
            }

            await updateProduct(id as string, {
                name: name.trim(),
                price: Number(price),
                quantity: Number(quantity),
                imageUrl
            });

            alert("Product updated successfully");
            router.back();
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product");
        } finally {
            setUpdating(false); 
        }
    };


 return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            {/* Header with back button - NEW */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Text className="text-2xl text-gray-600">←</Text>
                </Pressable>
                <Text className="flex-1 text-xl font-bold text-gray-800 text-center mr-8">Edit Product</Text>
            </View>

            <View className="p-5">
                {/* Product Name Field - IMPROVED */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Product Name</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-gray-50">
                        <Text className="text-gray-400 mr-2">📦</Text>
                        <TextInput
                            className="flex-1 py-3 text-base"
                            placeholder="Enter product name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Price Field - IMPROVED */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Price (LKR)</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-gray-50">
                        <Text className="text-gray-400 mr-2">💰</Text>
                        <TextInput
                            className="flex-1 py-3 text-base"
                            placeholder="0.00"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Quantity Field - IMPROVED */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Quantity</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-gray-50">
                        <Text className="text-gray-400 mr-2">🔢</Text>
                        <TextInput
                            className="flex-1 py-3 text-base"
                            placeholder="0"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Image Section - IMPROVED */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Product Image</Text>
                    
                    {/* Image Display - IMPROVED */}
                    {(imageUri || existingImageUrl) ? (
                        <View className="relative mb-3">
                            <Image
                                source={{ uri: imageUri || existingImageUrl }}
                                className="h-48 w-full rounded-xl"
                                resizeMode="cover"
                            />
                            {/* Remove Image Button - NEW */}
                            {(imageUri || existingImageUrl) && (
                                <Pressable
                                    onPress={() => {
                                        setImageUri(null);
                                        setExistingImageUrl("");
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                                >
                                    <Text className="text-white text-xs">✕</Text>
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        // Empty Image Placeholder - NEW
                        <View className="h-32 w-full bg-gray-100 rounded-xl mb-3 justify-center items-center border-2 border-dashed border-gray-300">
                            <Text className="text-4xl text-gray-400">📷</Text>
                            <Text className="text-gray-400 mt-2">No image selected</Text>
                        </View>
                    )}

                    {/* Change Image Button - IMPROVED */}
                    <Pressable
                        className="border-2 border-dashed border-blue-400 bg-blue-50 p-4 rounded-xl flex-row justify-center items-center"
                        onPress={pickImage}
                    >
                        <Text className="text-blue-600 mr-2 text-lg">🖼️</Text>
                        <Text className="text-blue-600 font-semibold">
                            {imageUri || existingImageUrl ? "Change Image" : "Add Image"}
                        </Text>
                    </Pressable>
                </View>

                {/* Update Button - IMPROVED */}
                <Pressable
                    className={`rounded-xl p-4 mt-6 ${updating ? 'bg-blue-400' : 'bg-blue-600'}`}
                    onPress={handleUpdate}
                    disabled={updating}
                >
                    {updating ? (
                        <View className="flex-row justify-center items-center">
                            <ActivityIndicator color="#fff" />
                            <Text className="text-white font-bold text-lg ml-2">Updating...</Text>
                        </View>
                    ) : (
                        <Text className="text-white text-center font-bold text-lg">Update Product</Text>
                    )}
                </Pressable>

                {/* Cancel Button - NEW */}
                <Pressable
                    className="mt-3 p-4 rounded-xl border border-gray-300"
                    onPress={() => router.back()}
                >
                    <Text className="text-gray-600 text-center font-semibold">Cancel</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}