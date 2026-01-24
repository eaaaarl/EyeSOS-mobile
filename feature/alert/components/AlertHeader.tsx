import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface AlertHeaderProps {
  topInset?: number;
}

export function AlertHeader({ topInset = 0 }: AlertHeaderProps) {
  return (
    <View className="bg-white px-4 py-3 border-b border-gray-100" style={{ marginTop: topInset }}>
      <View className="items-center">
        <View className="w-16 h-16 bg-[#E63946] rounded-full items-center justify-center mb-3">
          <Ionicons name="alert-circle" size={36} color="white" />
        </View>
        <Text className="text-2xl font-bold text-gray-900">Emergency Alert</Text>
        <Text className="text-gray-600 font-semibold text-sm mt-1">Send your location and details to MDRRMC</Text>
      </View>
    </View>
  );
}
