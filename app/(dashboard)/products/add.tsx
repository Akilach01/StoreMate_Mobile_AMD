import { Pressable, TextInput, View, Text } from "react-native";
import { useState } from "react";
import { addProduct } from "@/services/productService";
import { router } from "expo-router";


export default function AddProduct(){
    const[name,setName]=useState("");
    const[price,setPrice]=useState("");
    const[quantity,setQuantity]=useState("");

    const handleSave = async()=>{
        await addProduct({name,price:Number(price),quantity:Number(quantity)});
        router.back();
    };

    return(
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

            <Pressable
              className="bg-blue-600 rounded-lg p-3"
              onPress={handleSave}>
              <Text className="text-white text-center font-semibold">Save Product</Text>
            </Pressable>
        </View>
    );
}