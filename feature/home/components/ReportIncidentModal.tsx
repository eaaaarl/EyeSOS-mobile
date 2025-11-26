import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ReportIncidentModalProps {
  visible: boolean;
  onClose: () => void;
  onRoute: () => void;
}

export default function ReportIncidentModal({ onClose, visible, onRoute }: ReportIncidentModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">Report Incident</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Upload Photo</Text>
                <TouchableOpacity onPress={onRoute} className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center active:border-[#E63946]">
                  <Ionicons name="camera" size={48} color="#9CA3AF" />
                  <Text className="text-sm text-gray-600 mt-2 font-semibold">
                    Click to take photo or upload image
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
                <View className="flex-row gap-2">
                  <View className="flex-1 px-4 py-3 border border-gray-300 rounded-lg">
                    <Text className="text-gray-500">Address or location</Text>
                  </View>
                  <TouchableOpacity className="px-4 py-3 bg-gray-100 active:bg-gray-200 rounded-lg">
                    <Ionicons name="location" size={20} color="#4B5563" />
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Your coordinates will be automatically sent to MDRRMC
                </Text>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                <View className="px-4 py-3 border border-gray-300 rounded-lg min-h-[100px]">
                  <Text className="text-gray-500">Describe what you see...</Text>
                </View>
              </View>

              <TouchableOpacity className="bg-[#E63946] active:bg-[#D32F2F] py-3 rounded-lg items-center">
                <Text className="text-white font-semibold">Send Report to MDRRMC</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
