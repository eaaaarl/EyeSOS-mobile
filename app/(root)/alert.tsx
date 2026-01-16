import { useGetProfilesQuery } from '@/feature/auth/api/authApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Alert as RNAlert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Alert() {

  const user = useAppSelector((state) => state.auth)

  // get current user profile by ID
  const { data: userProfile, isLoading: userProfileLoading } = useGetProfilesQuery({ id: user.id }, {
    skip: !user.id
  })

  const insets = useSafeAreaInsets()
  const [selectedEmergency, setSelectedEmergency] = useState('fire');
  const [alertSent, setAlertSent] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    full_address: string;
    address: any;
  } | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const getCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        RNAlert.alert(
          'Location Permission Required',
          'Please enable location permissions to see your current location.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const rawAddress = address[0]?.formattedAddress || 'Unknown location';
      const parts = rawAddress.split(',').slice(1);
      const cleanedAddress = parts.join(',').trim();

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        full_address: cleanedAddress || rawAddress,
        address: address[0]
      });
    } catch (error) {
      console.log('Location error:', error);
      RNAlert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or check your location settings.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const emergencyTypes = [
    { id: 'fire', label: 'Fire', icon: 'flame', color: '#DC2626' },
    { id: 'flood', label: 'Flood', icon: 'water', color: '#2563EB' },
    { id: 'medical', label: 'Medical Emergency', icon: 'medkit', color: '#10B981' },
    { id: 'other', label: 'Other Emergency', icon: 'alert', color: '#F59E0B' },
  ];

  if (alertSent) {
    return (
      <View className="flex-1 bg-[#E63946]">
        <StatusBar barStyle="light-content" backgroundColor="#E63946" />

        <View className="flex-1 items-center justify-center px-6" style={{ marginTop: insets.top }}>
          <View className="w-32 h-32 mt-8 bg-white/20 rounded-full items-center justify-center mb-8 relative">
            <Ionicons name="checkmark-circle" size={80} color="white" />
            <View className="absolute w-40 h-40 bg-white rounded-full opacity-10 animate-pulse" />
            <View className="absolute w-48 h-48 bg-white rounded-full opacity-5 animate-pulse" />
          </View>

          <Text className="text-white text-3xl font-bold mb-3 text-center">Alert Sent!</Text>
          <Text className="text-white/90 text-base mb-8 text-center px-4">
            MDRRMC has received your emergency alert and location
          </Text>

          <View className="bg-white/10 rounded-2xl p-6 mb-8 w-full">
            <View className="flex-row items-center gap-3 mb-4 pb-4 border-b border-white/20">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/60 text-xs mb-1">Name</Text>
                <Text className="text-white font-semibold text-base">{userProfile?.profile.name}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 mb-4 pb-4 border-b border-white/20">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="call" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/60 text-xs mb-1">Contact</Text>
                <Text className="text-white font-semibold text-base">{userProfile?.profile.mobileNo}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 mb-4 pb-4 border-b border-white/20">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="location" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/60 text-xs mb-1">Location</Text>
                <Text className="text-white font-semibold text-base">{userLocation?.full_address}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="flame" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/60 text-xs mb-1">Emergency Type</Text>
                <Text className="text-white font-semibold text-base">{selectedEmergency}</Text>
              </View>
            </View>
          </View>

          <View className="gap-3 w-full px-4">
            <TouchableOpacity className="bg-white py-4 rounded-full shadow-lg">
              <Text className="text-[#E63946] font-bold text-base text-center">Pin Your Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAlertSent(false)}
              className="py-3"
              style={{ marginBottom: insets.bottom }}
            >
              <Text className="text-white font-semibold text-center">Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const initialLoading = (userProfileLoading || isLoadingLocation);

  const handleSendAlert = async () => {
    // Refresh location right before sending
    await getCurrentLocation();

    // Show confirmation
    RNAlert.alert(
      'Confirm Emergency Alert',
      'This will send your current location and details to MDRRMC. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => setAlertSent(true)
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView className="flex-1 px-4 py-6" style={{ marginBottom: insets.bottom }}>
        <View className="bg-white px-4 py-3 border-b border-gray-100" style={{ marginTop: insets.top }}>
          <View className="items-center">
            <View className="w-16 h-16 bg-[#E63946] rounded-full items-center justify-center mb-3">
              <Ionicons name="alert-circle" size={36} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">Emergency Alert</Text>
            <Text className="text-gray-600 font-semibold text-sm mt-1">Send your location and details to MDRRMC</Text>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Your Information</Text>

          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-600 mb-2">Name</Text>
            <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <Text className="text-gray-900 font-semibold">{userProfile?.profile.name}</Text>
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-600 mb-2">Contact Number</Text>
            <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <Text className="text-gray-900 font-semibold">{userProfile?.profile.mobileNo}</Text>
            </View>
          </View>
        </View>

        <View className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="location" size={24} color="#2563EB" />
            <Text className="font-bold text-gray-900 text-base">Your Current Location</Text>
          </View>
          <Text className="text-sm text-gray-700 mb-1 font-medium">{userLocation?.full_address}</Text>
          <Text className="text-xs text-gray-600 mb-3">Latitude: {userLocation?.latitude}, Longitude: {userLocation?.longitude}</Text>
          <View className="flex-row items-center gap-2 pt-3 border-t border-blue-200">
            <View className="w-2 h-2 bg-green-500 rounded-full" />
            <Text className="text-xs text-green-700 font-semibold">GPS Location Acquired</Text>
          </View>
        </View>

        {/* Emergency Type Selection */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Select Emergency Type</Text>

          <View className="gap-3">
            {emergencyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedEmergency(type.id)}
                className={`flex-row items-center gap-3 px-4 py-4 rounded-lg border-2 ${selectedEmergency === type.id
                  ? 'bg-red-50 border-[#E63946]'
                  : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: selectedEmergency === type.id ? `${type.color}20` : '#F3F4F6' }}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={selectedEmergency === type.id ? type.color : '#6B7280'}
                  />
                </View>
                <Text
                  className={`text-base font-semibold flex-1 ${selectedEmergency === type.id ? 'text-gray-900' : 'text-gray-700'
                    }`}
                >
                  {type.label}
                </Text>
                {selectedEmergency === type.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#E63946" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Details */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-3">Additional Details (Optional)</Text>
          <View className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 min-h-24">
            <Text className="text-gray-500">Describe the situation...</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-2">
            Add any important information that can help responders
          </Text>
        </View>

        {/* Important Notice */}
        <View className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
          <View className="flex-row items-start gap-2">
            <Ionicons name="information-circle" size={20} color="#F59E0B" />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-yellow-900 mb-1">Important</Text>
              <Text className="text-xs text-yellow-800">
                By sending this alert, MDRRMC will receive your name, contact number, GPS location, and emergency type. Response team will be dispatched immediately.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSendAlert}
          className="bg-[#E63946] active:bg-[#D32F2F] py-4 rounded-full shadow-lg mb-4"
          disabled={isLoadingLocation || !userLocation}
        >
          <Text className="text-white font-bold text-lg text-center">{isLoadingLocation ? 'Getting your location...' : 'Send Emergency Alert'}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-3 mb-6" onPress={() => router.replace('/(root)/home')}>
          <Text className="text-gray-500 font-medium text-center">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>


      <Modal
        transparent
        visible={initialLoading}
        animationType="fade"
      >
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
