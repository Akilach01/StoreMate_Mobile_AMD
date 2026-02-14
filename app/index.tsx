import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Index() {
  const {user, loading} = useAuth();

  useEffect(() => {
    console.log('[Index] State updated - loading:', loading, 'user:', user?.email || 'No user');
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
    console.log('[Index] No user, redirecting to login');
    return <Redirect href="/(auth)/login" />;
  }

  console.log('[Index] User found, redirecting to dashboard');
  return <Redirect href="/(dashboard)/home" />;
}