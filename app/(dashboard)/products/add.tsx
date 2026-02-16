import { Pressable, TextInput, View, Text, Image, ActivityIndicator, Alert } from "react-native";
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

  // Pick from gallery
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please grant permission to access your photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Take photo
  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please grant camera permission");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Save product
  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter product name");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Validation Error", "Please enter price");
      return;
    }
    if (!quantity.trim()) {
      Alert.alert("Validation Error", "Please enter quantity");
      return;
    }

    const priceNum = Number(price);
    const quantityNum = Number(quantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Validation Error", "Please enter a valid price");
      return;
    }
    if (isNaN(quantityNum) || quantityNum < 0) {
      Alert.alert("Validation Error", "Please enter a valid quantity");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (imageUri) {
        try {
           console.log("Attempting to upload image...");
          imageUrl = await uploadToCloudinary(imageUri);
           console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          Alert.alert(
            "Warning",
            "Image upload failed but product will be saved without image"
            
          );
          // Continue without image
        }
      }

      await addProduct({
        name: name.trim(),
        price: priceNum,
        quantity: quantityNum,
        imageUrl,
      });

      Alert.alert("Success", "Product added successfully", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error("Add product failed:", err);
      Alert.alert("Error", "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className=" bg-white flex-1">
      <View className="flex-1 justify-center px-6 -mt-10">
      <Text className="text-2xl font-bold mb-4">Add New Product</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        editable={!loading}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        editable={!loading}
      />

      <View className="flex-row gap-2 mb-4">
        <Pressable 
          className="flex-1 bg-gray-200 p-3 rounded-lg" 
          onPress={pickImage}
          disabled={loading}
        >
          <Text className="text-center">📷 Pick From Gallery</Text>
        </Pressable>

        <Pressable 
          className="flex-1 bg-gray-200 p-3 rounded-lg" 
          onPress={takePhoto}
          disabled={loading}
        >
          <Text className="text-center">📸 take a photo</Text>
        </Pressable>
      </View>

      {imageUri && (
        <View className="mb-4 relative">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />
          <Pressable 
            className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
            onPress={() => setImageUri(null)}
          >
            <Text className="text-white">✕</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        className={`rounded-lg p-4 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <View className="flex-row justify-center items-center">
            <ActivityIndicator color="#fff" />
            <Text className="text-white ml-2 font-semibold">Saving...</Text>
          </View>
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Save Product
          </Text>
        )}
      </Pressable>
    </View>
    </View>
  );
}