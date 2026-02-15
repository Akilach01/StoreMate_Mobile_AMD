import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";
import { Ionicons } from "@expo/vector-icons";


export default function Login(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const handleLogin = async() => {
        setEmailError("");
        setPasswordError("");

        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email");
            return;
        }

        if (!password) {
            setPasswordError("Password is required");
            return;
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(dashboard)/home");
        } catch (error: any) {
            const errorMessage = error.message.includes("user-not-found") 
                ? "No account found with this email"
                : error.message.includes("wrong-password")
                ? "Incorrect password"
                : error.message;
            Alert.alert("Login Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

   return (
    
  <View className="flex-1 bg-gray-100">
    <View className="bg-red-500 h-20 w-20 mb-4" />

    <View className="flex-1 justify-center px-6">

      {/* Header */}
      <View className="items-center mb-10">
        <View className="bg-blue-600 rounded-full p-4 mb-4">
          <Ionicons name="storefront-outline" size={32} color="white" />
        </View>
        <Text className="text-3xl font-extrabold text-gray-900">StoreMate</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Smart inventory management for your business
        </Text>
      </View>

      {/* Card */}
      <View className="bg-white rounded-2xl p-6 shadow-md">

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 py-4 px-3 text-base"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              keyboardType="email-address"
              editable={!loading}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {emailError ? (
            <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white">
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 py-4 px-3 text-base"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry
              editable={!loading}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {passwordError ? (
            <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
          ) : null}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`rounded-xl py-4 flex-row justify-center items-center ${
            loading ? "bg-blue-400" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                Signing in...
              </Text>
            </>
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">New to StoreMate? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text className="text-blue-600 font-bold">Create a account</Text>
          </TouchableOpacity>
        </Link>
      </View>

    </View>
  </View>
);

}
