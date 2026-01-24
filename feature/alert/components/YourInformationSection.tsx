import React from 'react';
import { Text, View } from 'react-native';

export interface AlertProfile {
  name?: string;
  mobileNo?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
}

interface YourInformationSectionProps {
  profile: AlertProfile | undefined;
}

export function YourInformationSection({ profile }: YourInformationSectionProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-base font-bold text-gray-900 mb-3">Your Information</Text>

      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-600 mb-2">Name</Text>
        <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <Text className="text-gray-900 font-semibold">{profile?.name}</Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-600 mb-2">Contact Number</Text>
        <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <Text className="text-gray-900 font-semibold">{profile?.mobileNo}</Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-600 mb-2">Emergency Contact Name</Text>
        <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <Text className="text-gray-900 font-semibold">{profile?.emergency_contact_name || '—'}</Text>
        </View>
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-600 mb-2">Emergency Contact Number</Text>
        <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <Text className="text-gray-900 font-semibold">{profile?.emergency_contact_number ?? '—'}</Text>
        </View>
      </View>
    </View>
  );
}
