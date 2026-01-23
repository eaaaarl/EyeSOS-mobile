import { useCompleteProfileMutation } from '@/feature/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type FormData = {
  permanentAddress: string
  phoneNumber: string
  emergencyContactName: string
  emergencyContactNumber: string
  birthDate: Date | null
  bio: string
}

type PhoneField = 'phoneNumber' | 'emergencyContactNumber'

export default function CompleteProfileScreen() {
  const insets = useSafeAreaInsets()
  const user = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState<FormData>({
    permanentAddress: '',
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    birthDate: null,
    bio: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleChange = (field: keyof FormData, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Validate name field (no numbers allowed)
  const handleNameChange = (value: string) => {
    // Remove any numbers from the input
    const cleanedValue = value.replace(/[0-9]/g, '')
    handleChange('emergencyContactName', cleanedValue)
  }

  // Format phone number as user types
  const handlePhoneChange = (field: PhoneField, value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '')
    handleChange(field, cleaned)
  }

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      handleChange('birthDate', selectedDate)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const [completeProfile, { isLoading }] = useCompleteProfileMutation()

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.phoneNumber || !formData.emergencyContactName || !formData.emergencyContactNumber) {
      Alert.alert('Required Fields', 'Please fill in all required fields')
      return
    }

    // Validate phone number length (at least 10 digits)
    if (formData.phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number')
      return
    }

    if (formData.emergencyContactNumber.length < 10) {
      Alert.alert('Invalid Emergency Contact', 'Please enter a valid emergency contact number')
      return
    }

    console.log('Form submitted:', formData)

    const payload = {
      emergency_contact_name: formData.emergencyContactName,
      emergency_contact_number: Number(formData.emergencyContactNumber),
      birth_date: formData.birthDate ? formatDate(formData.birthDate) : '',
      permanent_address: formData.permanentAddress,
      mobileNo: Number(formData.phoneNumber),
      bio: formData.bio
    }

    await completeProfile({ payload, currentUserId: user.id })

    setFormData({
      bio: '',
      birthDate: null,
      emergencyContactName: '',
      emergencyContactNumber: '',
      permanentAddress: '',
      phoneNumber: ''
    })

    router.replace('/(root)/home')
  }

  return (
    <View className="flex-1 bg-gray-50">
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
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex-row">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text className="text-sm text-gray-700 ml-3 flex-1">
              Complete your profile to access emergency features and incident reporting
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Permanent Address
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="e.g., 123 Main St, Davao City"
              placeholderTextColor="#9CA3AF"
              value={formData.permanentAddress}
              onChangeText={(value) => handleChange('permanentAddress', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Phone Number <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="e.g., 09171234567"
              placeholderTextColor="#9CA3AF"
              value={formData.phoneNumber}
              onChangeText={(value) => handlePhoneChange('phoneNumber', value)}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Emergency Contact Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="e.g., Juan Dela Cruz"
              placeholderTextColor="#9CA3AF"
              value={formData.emergencyContactName}
              onChangeText={handleNameChange}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Letters only, no numbers allowed
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Emergency Contact Number <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="e.g., 09171234567"
              placeholderTextColor="#9CA3AF"
              value={formData.emergencyContactNumber}
              onChangeText={(value) => handlePhoneChange('emergencyContactNumber', value)}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Birth Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
            >
              <Text className={`text-base ${formData.birthDate ? 'text-gray-900' : 'text-gray-400'}`}>
                {formData.birthDate ? formatDate(formData.birthDate) : 'Select your birth date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.birthDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Bio
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
              placeholder="e.g., I'm a software developer who loves hiking"
              placeholderTextColor="#9CA3AF"
              value={formData.bio}
              onChangeText={(value) => handleChange('bio', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#E63946] py-4 rounded-lg flex-row items-center justify-center gap-2 shadow-lg active:bg-[#D32F2F] mb-8"
            disabled={isLoading}
            style={{ marginBottom: insets.bottom }}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white font-semibold text-base">
              Complete Profile
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {isLoading && (
        <Modal
          transparent
          visible={isLoading}
          animationType="fade"
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <View className="bg-white p-6 rounded-2xl items-center">
              <ActivityIndicator size="large" color="#0286FF" />
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}