import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/firebase";

export default function Register(){
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
        <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
            <View className="flex-1 justify-center px-6 py-8">
                {/* Logo/Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-blue-600 text-center mb-3">
                        StoreMate
                    </Text>
                    <Text className="text-gray-600 text-center text-base">
                        Create your account
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
                <View className="mb-5">
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

                {/* Confirm Password Input */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
                    <TextInput
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setConfirmPasswordError("");
                        }}
                        className="border-2 border-gray-300 rounded-xl p-4 text-base bg-white"
                        secureTextEntry={true}
                        editable={!loading}
                        placeholderTextColor="#999"
                    />
                    {confirmPasswordError ? (
                        <Text className="text-red-500 text-sm mt-1">{confirmPasswordError}</Text>
                    ) : null}
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={loading}
                    className={`rounded-xl p-4 mb-4 flex-row justify-center items-center ${
                        loading ? "bg-blue-400" : "bg-blue-600"
                    }`}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text className="text-white font-bold text-lg ml-2">Creating Account...</Text>
                        </>
                    ) : (
                        <Text className="text-white font-bold text-lg">Register</Text>
                    )}
                </TouchableOpacity>

                {/* Login Link */}
                <View className="flex-row justify-center items-center">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Login</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}