import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PersonalInformationModalProps {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
  userProfile: {
    name?: string;
    email?: string;
    mobileNo?: string;
    avatarUrl?: string;
    birth_date?: string;
    permanent_address?: string;
    bio?: string;
    emergency_contact_name?: string;
    emergency_contact_number?: string;
  } | null;
}

export default function PersonalInformationModal({ visible, onClose, isLoading, userProfile }: PersonalInformationModalProps) {
  const insets = useSafeAreaInsets();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

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
            <Text className="text-lg font-bold text-gray-900">Personal Information</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="p-4"
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          >
            {isLoading ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-gray-600 mt-4">Loading your information...</Text>
              </View>
            ) : userProfile ? (
              <View className="gap-4">
                <View className="items-center mb-4">
                  {userProfile.avatarUrl ? (
                    <Image 
                      source={{ uri: userProfile.avatarUrl }} 
                      className="w-20 h-20 rounded-full mb-3" 
                      resizeMode="cover" 
                    />
                  ) : (
                    <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
                      <Text className="text-blue-600 text-3xl font-bold">
                        {userProfile.name?.charAt(0) || 'U'}
                      </Text>
                    </View>
                  )}
                  <Text className="text-lg font-semibold text-gray-900">Profile Details</Text>
                </View>

                <View className="bg-gray-50 rounded-lg p-4 mb-4">
                  <Text className="text-sm font-medium text-gray-500 mb-3">Basic Information</Text>
                  <View className="gap-3">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="person-outline" size={18} color="#2563EB" />
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">Full Name</Text>
                        <Text className="text-sm text-gray-900 font-medium">
                          {userProfile.name || 'Not provided'}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Ionicons name="mail-outline" size={18} color="#2563EB" />
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">Email Address</Text>
                        <Text className="text-sm text-gray-900 font-medium">
                          {userProfile.email || 'Not provided'}
                        </Text>
                      </View>
                    </View>

                    {userProfile.mobileNo && (
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="call-outline" size={18} color="#2563EB" />
                        <View className="flex-1">
                          <Text className="text-xs text-gray-500 mb-1">Mobile Number</Text>
                          <Text className="text-sm text-gray-900 font-medium">
                            {userProfile.mobileNo}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                {(userProfile.birth_date || userProfile.permanent_address || userProfile.bio) && (
                  <View className="bg-gray-50 rounded-lg p-4 mb-4">
                    <Text className="text-sm font-medium text-gray-500 mb-3">Additional Information</Text>
                    <View className="gap-3">
                      {userProfile.birth_date && (
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="calendar-outline" size={18} color="#2563EB" />
                          <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-1">Date of Birth</Text>
                            <Text className="text-sm text-gray-900 font-medium">
                              {formatDate(userProfile.birth_date)}
                            </Text>
                          </View>
                        </View>
                      )}

                      {userProfile.permanent_address && (
                        <View className="flex-row items-start gap-2">
                          <Ionicons name="home-outline" size={18} color="#2563EB" style={{ marginTop: 2 }} />
                          <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-1">Permanent Address</Text>
                            <Text className="text-sm text-gray-900 font-medium leading-5">
                              {userProfile.permanent_address}
                            </Text>
                          </View>
                        </View>
                      )}

                      {userProfile.bio && (
                        <View className="flex-row items-start gap-2">
                          <Ionicons name="document-text-outline" size={18} color="#2563EB" style={{ marginTop: 2 }} />
                          <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-1">Bio</Text>
                            <Text className="text-sm text-gray-900 font-medium leading-5">
                              {userProfile.bio}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {(userProfile.emergency_contact_name || userProfile.emergency_contact_number) && (
                  <View className="bg-blue-50 rounded-lg p-4">
                    <View className="flex-row items-center gap-2 mb-3">
                      <Ionicons name="shield-checkmark-outline" size={18} color="#2563EB" />
                      <Text className="text-sm font-medium text-blue-900">Emergency Contact</Text>
                    </View>
                    <View className="gap-2">
                      {userProfile.emergency_contact_name && (
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="person-outline" size={16} color="#2563EB" />
                          <Text className="text-sm text-blue-700">
                            <Text className="font-medium">Name: </Text>
                            {userProfile.emergency_contact_name}
                          </Text>
                        </View>
                      )}
                      {userProfile.emergency_contact_number && (
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="call-outline" size={16} color="#2563EB" />
                          <Text className="text-sm text-blue-700">
                            <Text className="font-medium">Number: </Text>
                            {userProfile.emergency_contact_number}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="py-12 items-center justify-center">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="person-outline" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-gray-600 text-center">
                  No personal information available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
