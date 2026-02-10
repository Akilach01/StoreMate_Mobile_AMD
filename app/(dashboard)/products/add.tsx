import { Pressable, TextInput, View, Text, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { addProduct } from "@/services/productService";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/services/cloudinary";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //  Pick from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  //  Take photo
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  //  Save product
  const handleSave = async () => {
    if (!name || !price || !quantity) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (imageUri) {
        imageUrl = await uploadToCloudinary(imageUri);
      }

      await addProduct({
        name,
        price: Number(price),
        quantity: Number(quantity),
        imageUrl,
      });

      router.back();
    } catch (err) {
      console.error("Add product failed:", err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 bg-white flex-1">
      <Text className="text-2xl font-bold mb-4">Add New Product</Text>

      <TextInput
        className="border border-gray-300 rounded p-2 mb-4"
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="border border-gray-300 rounded p-2 mb-4"
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        className="border border-gray-300 rounded p-2 mb-4"
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Pressable className="bg-gray-300 p-3 rounded mb-2" onPress={pickImage}>
        <Text className="text-center">Pick Image from Gallery</Text>
      </Pressable>

      <Pressable className="bg-gray-300 p-3 rounded" onPress={takePhoto}>
        <Text className="text-center">Take Photo</Text>
      </Pressable>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-40 mt-4 rounded"
          resizeMode="cover"
        />
      )}

      <Pressable
        className="bg-blue-600 rounded-lg p-3 mt-6"
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">
            Save Product
          </Text>
        )}
      </Pressable>
    </View>
  );
}
