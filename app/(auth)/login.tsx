import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";

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
        <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
            <View className="flex-1 justify-center px-6 py-8">
                {/* Logo/Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-blue-600 text-center mb-3">
                        StoreMate
                    </Text>
                    <Text className="text-gray-600 text-center text-base">
                        Manage your products efficiently
                    </Text>
                </View>

                {/* Email Input */}
                <View className="mb-5">
                    <Text className="text-gray-700 font-semibold mb-2">Email Address</Text>
                    <TextInput
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError("");
                        }}
                        className="border-2 border-gray-300 rounded-xl p-4 text-base bg-white"
                        keyboardType="email-address"
                        editable={!loading}
                        placeholderTextColor="#999"
                    />
                    {emailError ? (
                        <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
                    ) : null}
                </View>

                {/* Password Input */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Password</Text>
                    <TextInput
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError("");
                        }}
                        className="border-2 border-gray-300 rounded-xl p-4 text-base bg-white"
                        secureTextEntry={true}
                        editable={!loading}
                        placeholderTextColor="#999"
                    />
                    {passwordError ? (
                        <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
                    ) : null}
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className={`rounded-xl p-4 mb-4 flex-row justify-center items-center ${
                        loading ? "bg-blue-400" : "bg-blue-600"
                    }`}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text className="text-white font-bold text-lg ml-2">Logging in...</Text>
                        </>
                    ) : (
                        <Text className="text-white font-bold text-lg">Login</Text>
                    )}
                </TouchableOpacity>

                {/* Register Link */}
                <View className="flex-row justify-center items-center">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Register</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
