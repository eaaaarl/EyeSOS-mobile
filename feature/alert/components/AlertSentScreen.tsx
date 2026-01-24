import { profile } from '@/feature/auth/api/interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { UserLocation } from './LocationSection';

interface AlertSentScreenProps {
  profile: profile | undefined;
  userLocation: UserLocation | null;
  additionalDetails: string;
  onPinLocation: () => void;
  onResetAndGoHome: () => void;
  topInset: number;
  bottomInset: number;
  isLoading?: boolean;
}

export function AlertSentScreen({
  profile,
  userLocation,
  additionalDetails,
  onPinLocation,
  onResetAndGoHome,
  topInset,
  bottomInset,
  isLoading
}: AlertSentScreenProps) {
  const hasEmergencyContact = profile?.emergency_contact_name || profile?.emergency_contact_number != null;

  return (
    <View className="flex-1 bg-[#E63946]">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: topInset,
          paddingBottom: bottomInset,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-32 h-32 mt-8 bg-white/20 rounded-full items-center justify-center mb-8 relative">
          <Ionicons name="checkmark-circle" size={80} color="white" />
          <View className="absolute w-40 h-40 bg-white rounded-full opacity-10 animate-pulse" />
          <View className="absolute w-48 h-48 bg-white rounded-full opacity-5 animate-pulse" />
        </View>

        <Text className="text-white text-3xl font-bold mb-3 text-center">Alert Sent!</Text>
        <Text className="text-white text-base mb-8 text-center px-4">
          MDRRMC has received your emergency alert and location
        </Text>

        <View className="bg-white/10 rounded-2xl p-6 mb-8 w-full">
          <View className="flex-row items-center gap-3 mb-4 pb-4">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="person" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white/60 text-xs mb-1">Name</Text>
              <Text className="text-white font-semibold text-base">{profile?.name}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 mb-4 pb-4">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="call" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white/60 text-xs mb-1">Contact</Text>
              <Text className="text-white font-semibold text-base">{profile?.mobileNo}</Text>
            </View>
          </View>

          {hasEmergencyContact ? (
            <>
              <View className="flex-row items-center gap-3 mb-4 pb-4 ">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="person-add" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white/60 text-xs mb-1">Emergency Contact Name</Text>
                  <Text className="text-white font-semibold text-base">{profile?.emergency_contact_name || '—'}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3 mb-4 pb-4 ">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="call-outline" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white/60 text-xs mb-1">Emergency Contact Number</Text>
                  <Text className="text-white font-semibold text-base">{profile?.emergency_contact_number ?? '—'}</Text>
                </View>
              </View>
            </>
          ) : null}

          <View className="flex-row items-center gap-3 mb-4 pb-4 ">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="location" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white/60 text-xs mb-1">Location</Text>
              <Text className="text-white font-semibold text-base">{userLocation?.full_address}</Text>
            </View>
          </View>

          {additionalDetails ? (
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="document-text" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/60 text-xs mb-1">Details</Text>
                <Text className="text-white font-semibold text-base">{additionalDetails}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View className="gap-3 w-full px-4">
          <TouchableOpacity onPress={onPinLocation} disabled={isLoading} className="bg-white py-4 rounded-full shadow-lg">
            <Text className="text-[#E63946] font-bold text-base text-center">Pin My Location</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onResetAndGoHome} className="py-3">
            <Text className="text-white font-semibold text-center">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent visible={isLoading} animationType="fade">
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <View className="bg-white p-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#0286FF" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
