import {  TouchableOpacity, View, Text, Pressable } from "react-native";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
import { router } from "@/.expo/types/router";

export default function Home(){
    return(
        <View className="flex-1 items-center justify-center">
            <Text className="text-lg">Welcome to StoreMate</Text>


        <Pressable
           className="bg-blue-600 p-4 rounded mt-4"
           onPress={() => router.push("/products")}
          >
        <Text className="text-white text-center text-lg">
         Manage Products</Text>
        </Pressable>

            <TouchableOpacity
                onPress={() =>signOut(auth)}
                className="mt-4 px-4 py-2 bg-red-500 rounded">
                <Text className="text-white text-center">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}