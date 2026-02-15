import "../global.css";
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const {user, loading} = useAuth();

  useEffect(() => {
    // Auth state updated
  }, [loading, user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 16}}>Initializing app...</Text>
      </View>
    );
  }

  if(!user){
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(dashboard)/home" />;
}