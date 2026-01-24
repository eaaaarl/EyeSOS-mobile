import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface AdditionalDetailsSectionProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function AdditionalDetailsSection({ value, onChangeText }: AdditionalDetailsSectionProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-base font-bold text-gray-900 mb-3">Additional Details (Optional)</Text>
      <TextInput
        placeholder="Describe the situation..."
        placeholderTextColor="#9CA3AF"
        className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 min-h-24"
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}
