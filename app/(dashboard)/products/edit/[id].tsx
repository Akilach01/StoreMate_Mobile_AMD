import { getProducts, updateProduct } from "@/services/productService";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text } from "react-native";





export default function EditProduct(){
    const{id} = useLocalSearchParams();
    const [name, setName] = useState("");
     const [price, setPrice] = useState("");
     const [quantity, setQuantity] = useState("");

     useEffect(() => {
      const load =async () => {
        const products = await getProducts();
        const product = products.find((p) => p.id === id);
        if(product){
            setName (product.name);
            setPrice (String(product.price));
            setQuantity (String(product.quantity));
        }
    };
    load();
},[]);

const handleUpdate = async () => {
    await updateProduct(id as string, {
        name,
        price:Number(price),
        quantity: Number (quantity),
    });
    router.back();
    alert("Product updated successfully");

};

return (
    <View className = "p-4 bg-white flex-1">
        <Text className="text-xl font-bold mb-4">Edit Product</Text>

         <TextInput className="border p-2 mb-3" value={name} onChangeText={setName} />
      <TextInput className="border p-2 mb-3" value={price} onChangeText={setPrice} />
      <TextInput className="border p-2 mb-3" value={quantity} onChangeText={setQuantity} />

      <Pressable className="bg-blue-600 p-3 rounded" onPress={handleUpdate}>
        <Text className="text-white text-center">Update</Text>
      </Pressable>
    </View>

);
}