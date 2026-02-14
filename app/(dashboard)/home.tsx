import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";

export default function Home(){
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        if (auth.currentUser?.email) {
            setDisplayName(auth.currentUser.email.split("@")[0]);
        }
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return(
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-blue-600 px-6 py-8 pt-12">
                <Text className="text-white text-3xl font-bold">Dashboard</Text>
                <Text className="text-blue-100 text-base mt-1">Welcome back, {displayName}!</Text>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-6 py-6">
                {/* Stats cards */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-gradient-to-r from-blue-50 to-blue-100 flex-1 rounded-xl p-4 mr-3">
                        <Text className="text-gray-600 text-sm">Total Products</Text>
                        <Text className="text-blue-600 text-3xl font-bold mt-2">0</Text>
                    </View>
                    <View className="bg-gradient-to-r from-green-50 to-green-100 flex-1 rounded-xl p-4">
                        <Text className="text-gray-600 text-sm">Total Value</Text>
                        <Text className="text-green-600 text-3xl font-bold mt-2">$0</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold text-lg mb-3">Quick Actions</Text>
                    
                    <Pressable
                        className="bg-blue-600 rounded-xl p-5 mb-3 flex-row items-center"
                        onPress={() => router.push("/(dashboard)/products")}
                    >
                        <View className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                            <Text className="text-white text-2xl">📦</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Manage Products</Text>
                            <Text className="text-blue-100 text-sm">View and edit your products</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        className="bg-green-600 rounded-xl p-5 mb-3 flex-row items-center"
                        onPress={() => router.push("/(dashboard)/products/add")}
                    >
                        <View className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                            <Text className="text-white text-2xl">➕</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Add Product</Text>
                            <Text className="text-green-100 text-sm">Create a new product</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        className="bg-purple-600 rounded-xl p-5 flex-row items-center"
                        onPress={() => {}}
                    >
                        <View className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                            <Text className="text-white text-2xl">👤</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Profile</Text>
                            <Text className="text-purple-100 text-sm">Coming soon...</Text>
                        </View>
                    </Pressable>
                </View>

                <View className="flex-1" />

                {/* Sign Out Button */}
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="bg-red-600 rounded-xl p-4 flex-row justify-center items-center"
                >
                    <Text className="text-white text-center font-bold text-base">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}