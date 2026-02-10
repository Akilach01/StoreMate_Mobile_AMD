import { getProducts, updateProduct } from "@/services/productService";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, Image } from "react-native";
import { uploadToCloudinary } from "@/services/cloudinary";
import * as ImagePicker from "expo-image-picker";



export default function EditProduct(){
    const{id} = useLocalSearchParams();
    const [name, setName] = useState("");
     const [price, setPrice] = useState("");
     const [quantity, setQuantity] = useState("");
     const [imageUri, setImageUri] = useState<string | null>(null);
     const[existingImageUrl, setExistingImageUrl] =useState("");

     useEffect(() => {
      const load =async () => {
        const products = await getProducts();
        const product = products.find((p) => p.id === id);
        if(product){
            setName (product.name);
            setPrice (String(product.price));
            setQuantity (String(product.quantity));
             setExistingImageUrl(product.imageUrl || "");
        }
    };
    load();
},[]);

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
  let imageUrl = existingImageUrl;

  if (imageUri) {
    imageUrl = await uploadToCloudinary(imageUri);
  }
    await updateProduct(id as string, {
        name,
        price:Number(price),
        quantity: Number (quantity),
        imageUrl
    });
    
    alert("Product updated successfully");
    router.back();

};

return (
    <View className = "p-4 bg-white flex-1">
        <Text className="text-xl font-bold mb-4">Edit Product</Text>

         <TextInput className="border p-2 mb-3" value={name} onChangeText={setName} />
      <TextInput className="border p-2 mb-3" value={price} onChangeText={setPrice} />
      <TextInput className="border p-2 mb-3" value={quantity} onChangeText={setQuantity} />

{imageUri ? (
  <Image source={{ uri: imageUri }} className="h-32 w-full mb-3 rounded" />
) : existingImageUrl ? (
  <Image source={{ uri: existingImageUrl }} className="h-32 w-full mb-3 rounded" />
) : null}

<Pressable
  className="border border-dashed border-gray-400 p-3 rounded mb-4"
  onPress={pickImage}
>
  <Text className="text-center text-gray-700">
    Change Product Image
  </Text>
</Pressable>


      <Pressable className="bg-blue-600 p-3 rounded" onPress={handleUpdate}>
        <Text className="text-white text-center">Update</Text>
      </Pressable>
    </View>

);
}