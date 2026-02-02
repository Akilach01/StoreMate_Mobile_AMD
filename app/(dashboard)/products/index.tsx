import { getProducts } from "@/services/productService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";



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
                    <View className="border-b border-gray-200 py-4 rounded">
                        <Text className="text-lg font-medium">{item.name}</Text>
                        <Text className="text-gray-600">price :{item.price}</Text>
                         <Text className="text-gray-600">Qty :{item.quantity}</Text>


                         <View className="flex-row justify-between mt-2">
                            <Pressable
                            onPress={()=>
                                router.push('/products/edit/${item.id}')
                            }
                            >
                            <Text className="text-blue-600">Edit</Text>
                            </Pressable>

                            <Pressable
                            onPress={()=>{
                                await deleteProduct(item.id);
                                loadproducts();
                            }}
                            >
                            <Text className="text-red-600">Delete</Text>
                            </Pressable>
                         </View>
                    </View>
                )}
            />
            </View>
    );
 }






        </View>
        
    )
    
}