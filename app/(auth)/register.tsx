import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, TextInput, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";


export default function Register(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if(!email || !password) {
            Alert.alert("error","please fill all fields");
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Account created successfully");
            router.replace("/(dashboard)/home");
            
        } catch (error: any) {
            Alert.alert("Registration failed",error.message);
        }finally{
            setLoading(false);
        }
};
    return(
        <View className="flex-1 justify-center px-6 bg-white" >
        <Text className="text-3xl font-bold mb-6 text-center">Create a Account</Text>


      <TextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      className="border border-gray-300 rounded-lg p-3 mb-4"
      keyboardType="email-address"
      />

       <TextInput
      placeholder="password"
      value={password}
      onChangeText={setPassword}
      className="border border-gray-300 rounded-lg p-3 mb-6"
      secureTextEntry
      />

      <TouchableOpacity onPress={handleRegister}
      className="bg-black p-4 rounded-lg mb-4"
        disabled={loading}
      >
        <Text className="text-white text-center font-bold">
            {loading ? "Creating Account..." : "Register"}
        </Text>
      </TouchableOpacity>

      <Text className="text-center">
        Already have an account?{" "}
        <Link href = "/(auth)/login"className="text-blue-600 font-semibold">Login</Link>
        </Text>
    </View>
    );

}