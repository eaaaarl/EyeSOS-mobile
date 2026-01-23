import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CompleteProfileScreen() {
  const insets = useSafeAreaInsets()
  const [formData, setFormData] = useState({
    permanentAddress: '',
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    birthDate: '',
    bio: ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.phoneNumber || !formData.emergencyContactName || !formData.emergencyContactNumber) {
      Alert.alert('Required Fields', 'Please fill in all required fields')
      return
    }

    console.log('Form submitted:', formData)
    // Add your submission logic here (API call)
    // After successful submission:
    // router.back() or router.replace('/(root)/(tabs)')
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100"
        style={{ marginTop: insets.top }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Complete Profile</Text>
      </View>

      <KeyboardAwareScrollView className="flex-1">
        <View className="p-4">
          {/* Info Banner */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex-row">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text className="text-sm text-gray-700 ml-3 flex-1">
              Complete your profile to access emergency features and incident reporting
            </Text>
          </View>

          {/* Permanent Address */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Permanent Address
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="Enter your permanent address"
              placeholderTextColor="#9CA3AF"
              value={formData.permanentAddress}
              onChangeText={(value) => handleChange('permanentAddress', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Phone Number <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Emergency Contact Name */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Emergency Contact Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="Enter emergency contact name"
              placeholderTextColor="#9CA3AF"
              value={formData.emergencyContactName}
              onChangeText={(value) => handleChange('emergencyContactName', value)}
            />
          </View>

          {/* Emergency Contact Number */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Emergency Contact Number <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="Enter emergency contact number"
              placeholderTextColor="#9CA3AF"
              value={formData.emergencyContactNumber}
              onChangeText={(value) => handleChange('emergencyContactNumber', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Birth Date */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Birth Date
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#9CA3AF"
              value={formData.birthDate}
              onChangeText={(value) => handleChange('birthDate', value)}
            />
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Bio
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="Tell us about yourself"
              placeholderTextColor="#9CA3AF"
              value={formData.bio}
              onChangeText={(value) => handleChange('bio', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#E63946] py-4 rounded-lg flex-row items-center justify-center gap-2 shadow-lg active:bg-[#D32F2F] mb-8"
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white font-semibold text-base">
              Complete Profile
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}