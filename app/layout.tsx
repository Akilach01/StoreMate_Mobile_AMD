import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import { LogBox, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Suppress SafeAreaView deprecation warning from React Native internals
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function RootLayout(){
    return(
        <SafeAreaProvider>
            <AuthProvider>
                <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                    <StatusBar barStyle="dark-content" />
                    <Slot />
                </View>
            </AuthProvider>
        </SafeAreaProvider>
    );
}