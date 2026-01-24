import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export interface UserLocation {
  latitude: number;
  longitude: number;
  full_address: string;
  address?: unknown;
}

interface LocationSectionProps {
  location: UserLocation | null;
}

export function LocationSection({ location }: LocationSectionProps) {
  return (
    <View className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name="location" size={24} color="#2563EB" />
        <Text className="font-bold text-gray-900 text-base">Your Current Location</Text>
      </View>
      <Text className="text-sm text-gray-700 mb-1 font-medium">{location?.full_address}</Text>
      <Text className="text-xs text-gray-600 mb-3">
        Latitude: {location?.latitude}, Longitude: {location?.longitude}
      </Text>
      <View className="flex-row items-center gap-2 pt-3 border-t border-blue-200">
        <View className="w-2 h-2 bg-green-500 rounded-full" />
        <Text className="text-xs text-green-700 font-semibold">GPS Location Acquired</Text>
      </View>
    </View>
  );
}
