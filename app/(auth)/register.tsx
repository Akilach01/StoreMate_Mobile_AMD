import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";

export default function Register() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const handleRegister = async () => {
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

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

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => router.replace("/(dashboard)/home") }
            ]);
        } catch (error: any) {
            const errorMessage = error.message.includes("already-in-use")
                ? "Email is already registered"
                : error.message.includes("weak-password")
                    ? "Password is too weak"
                    : error.message;
            Alert.alert("Registration Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Color accent bar - matching login UI */}
            <View className="bg-red-500 h-20 w-20 mb-4" />

            <View className="flex-1 justify-center px-6">
                {/* Header - matching login UI style */}
                <View className="items-center mb-10">
                    <View className="bg-blue-600 rounded-full p-4 mb-4">
                        <Ionicons name="person-add-outline" size={32} color="white" />
                    </View>
                    <Text className="text-3xl font-extrabold text-gray-900">StoreMate</Text>
                    <Text className="text-gray-500 mt-2 text-center">
                        Create your account to get started
                    </Text>
                </View>

                {/* Card - matching login UI style */}
                <View className="bg-white rounded-2xl p-6 shadow-md">
                    {/* Email - matching login UI style */}
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

                    {/* Password - matching login UI style */}
                    <View className="mb-4">
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

                    {/* Confirm Password - matching login UI style */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white">
                            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                            <TextInput
                                className="flex-1 py-4 px-3 text-base"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setConfirmPasswordError("");
                                }}
                                secureTextEntry
                                editable={!loading}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        {confirmPasswordError ? (
                            <Text className="text-red-500 text-sm mt-1">{confirmPasswordError}</Text>
                        ) : null}
                    </View>r

                    {/* Register Button - matching login UI style */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className={`rounded-xl py-4 flex-row justify-center items-center ${loading ? "bg-blue-400" : "bg-blue-600"
                            }`}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="#fff" />
                                <Text className="text-white font-bold text-lg ml-2">
                                    Creating Account...
                                </Text>
                            </>
                        ) : (
                            <Text className="text-white font-bold text-lg">Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer - matching login UI style */}
                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}