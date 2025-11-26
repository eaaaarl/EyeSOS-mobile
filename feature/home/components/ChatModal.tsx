import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChatModal({ onClose, visible }: ChatModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl h-[80%]">
          <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
            <View>
              <Text className="font-bold text-gray-900">MDRRMC Response Team</Text>
              <Text className="text-xs text-green-600">● Online</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4 bg-gray-50">
            <View className="flex-row gap-2 mb-4">
              <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-semibold">MD</Text>
              </View>
              <View className="flex-1">
                <View className="bg-white rounded-lg p-3 shadow-sm">
                  <Text className="text-sm text-gray-900">
                    Thank you for your report. We have received your location and photo. Our team is
                    assessing the situation.
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">2 hours ago</Text>
              </View>
            </View>

            <View className="flex-row justify-end mb-4">
              <View className="items-end max-w-[80%]">
                <View className="bg-[#E63946] rounded-lg p-3 shadow-sm">
                  <Text className="text-sm text-white">
                    The water level is rising quickly. Several cars are stuck.
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">1 hour ago</Text>
              </View>
            </View>

            <View className="flex-row gap-2 mb-4">
              <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-semibold">MD</Text>
              </View>
              <View className="flex-1">
                <View className="bg-white rounded-lg p-3 shadow-sm">
                  <Text className="text-sm text-gray-900">
                    Emergency response team has been dispatched to your location. ETA 15 minutes.
                    Please stay in a safe area.
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">50 minutes ago</Text>
              </View>
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <View className="flex-row gap-2">
              <View className="flex-1 px-4 py-3 border border-gray-300 rounded-lg">
                <Text className="text-gray-500">Type a message...</Text>
              </View>
              <TouchableOpacity className="px-4 py-3 bg-[#E63946] active:bg-[#D32F2F] rounded-lg items-center justify-center">
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
