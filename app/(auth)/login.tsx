import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View,Text } from "react-native";
import { auth } from "../../services/firebase";



export default function Login(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] =useState(false);

    const handleLogin = async()=>{
        if (!email || !password) {
            Alert.alert("Error", "please fill all fields");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password );
            router.replace("/(dashboard)/home");
        } catch (error:any){
            Alert.alert("Login failed", error.message);
        }finally{
            setLoading(false);
        }
            
        };

        return(
          <View className="flex-1 justify-center px-6 bg-white">
            <Text className="text-3xl font-bold mb-6 text-center">
                 StoreMate Login
            </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-lg p-3 mb-6"
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-500 rounded-lg p-3 mb-4"
      >
        <Text className="text-white text-center font-bold">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text className="text-center">
        Don't have an account?{" "}
        <Link href="/(auth)/register" className="text-blue-500 font-bold">
          Register
        </Link>
      </Text>
    </View>

     );
}
