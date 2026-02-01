import {  TouchableOpacity, View, Text } from "react-native";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";

export default function Home(){
    return(
        <View className="flex-1 items-center justify-center">
            <Text className="text-lg">Welcome to StoreMate</Text>

            <TouchableOpacity
                onPress={() =>signOut(auth)}
                className="mt-4 px-4 py-2 bg-red-500 rounded">
                <Text className="text-white text-center">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}