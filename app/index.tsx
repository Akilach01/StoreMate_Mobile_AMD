import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const {user, loading} = useAuth();

  if (loading) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size ="large"/>
    </View>
  );
}

if(!user){
  return <Redirect href="/(auth)/login" />;
}

return <Redirect href="/(dashboard)/home" />;
}