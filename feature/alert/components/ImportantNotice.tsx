import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export function ImportantNotice() {
  return (
    <View className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
      <View className="flex-row items-start gap-2">
        <Ionicons name="information-circle" size={20} color="#F59E0B" />
        <View className="flex-1">
          <Text className="text-xs font-semibold text-yellow-900 mb-1">Important</Text>
          <Text className="text-xs text-yellow-800">
            By sending this alert, MDRRMC will receive your name, contact number, emergency contact (if set), and GPS
            location. Add details above so responders know what happened. Response team will be dispatched immediately.
          </Text>
        </View>
      </View>
    </View>
  );
}
