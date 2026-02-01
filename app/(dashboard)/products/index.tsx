import { getProducts } from "@/services/productService";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";



export default function productList() {
    const[products,setProducts] =useState<any[]>([]);

    const loadproducts =async()=>{
        const data = await getProducts();
        setProducts(data);
    };

    useEffect(()=>{
        loadproducts();
    },[]);

    return(
        <View className = "flex-1 p-4 bg-white">
          <Text className="text-2xl font-bold mb-4">Products</Text> 

          <Pressable
            className="bg-blue-600 rounded-lg p-3 mb-4"
            onPress={() => router.push('/products/add')}>
            <Text className="text-white text-center font-semibold">Add New Product</Text>
            </Pressable>

            <FlatList
               data = {products}
               keyExtractor={(item) => item.id}
                renderItem ={({item})=>(



        </View>
        
    )
    
}