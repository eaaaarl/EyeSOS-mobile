import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface InfoModalProps {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export default function InfoModal({ visible, title, description, onClose }: InfoModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">{title}</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
            <View className="bg-gray-50 rounded-lg p-4">
              <Text className="text-base text-gray-900 leading-6 font-normal">{description}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
