import { useGetProfilesQuery, useSignOutMutation } from '@/feature/auth/api/authApi';
import { useGetReportsQuery } from '@/feature/home/api/homeApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Profile() {
  const insets = useSafeAreaInsets();

  const currentUser = useAppSelector((state) => state.auth);

  // Get Reports Accidents by User Id
  const { data: accidentsReports, isLoading: accidentsReportsLoading } = useGetReportsQuery({
    userId: currentUser.id
  })

  // Get Profile By Id
  const { data: user, isLoading } = useGetProfilesQuery({ id: currentUser.id }, {
    skip: !currentUser.id
  });

  // Signout Mutation
  const [signOut] = useSignOutMutation()

  // My Location Modal State
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    full_address: string;
    address: any;
  } | null>(null);

  const handleSignOut = async () => {
    await signOut()
  }

  const totalReports = accidentsReports?.meta.pagination.totalCount

  const initialLoading = (isLoading || accidentsReportsLoading);

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
        Alert.alert(
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
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or check your location settings.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleOpenLocationModal = () => {
    setLocationModalVisible(true);
    if (!userLocation) {
      getCurrentLocation();
    }
  };

  const handleCloseLocationModal = () => {
    setLocationModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-100" style={{ marginTop: insets.top }}>
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white px-4 py-6 items-center border-b border-gray-100 mt-2">
          {user?.profile?.avatarUrl ? (
            <Image source={{ uri: user?.profile?.avatarUrl }} className="w-24 h-24 rounded-full mb-3" resizeMode="cover" />
          ) : (
            <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-4xl font-bold">
                {user?.profile?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          <Text className="text-2xl font-bold text-gray-900">
            {user?.profile?.name || 'User'}
          </Text>
          <Text className="text-gray-600 font-normal mt-1">
            {user?.profile?.email || ''}
          </Text>
          {user?.profile?.mobileNo && user?.profile?.mobileNo !== '' && (
            <Text className="text-sm text-gray-500 font-normal mt-1">
              {user?.profile?.mobileNo}
            </Text>
          )}

          <TouchableOpacity className="mt-4 px-6 py-2 bg-[#E63946] rounded-lg active:bg-[#D32F2F]">
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white mx-4 mt-6 mb-4 p-4 rounded-lg">
          <Text className="text-lg font-bold text-gray-900 mb-4">My Activity</Text>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold text-[#E63946]">{totalReports}</Text>
              <Text className="text-sm text-gray-600 font-normal mt-1">Reports</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold text-green-600">0</Text>
              <Text className="text-sm text-gray-600 font-normal mt-1">Resolved</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold text-yellow-600">0</Text>
              <Text className="text-sm text-gray-600 font-normal mt-1">Pending</Text>
            </View>
          </View>
        </View>

        <View className="bg-white mx-4 mb-4 rounded-lg overflow-hidden">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase">Account</Text>
          </View>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="person-outline" size={20} color="#2563EB" />
              </View>
              <Text className="text-base font-normal text-gray-900">Personal Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50"
            onPress={handleOpenLocationModal}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#7C3AED" />
              </View>
              <Text className="text-base text-gray-900 font-normal">My Location</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              </View>
              <Text className="text-base text-gray-900 font-normal">Emergency Contacts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="bg-white mx-4 mb-4 rounded-lg overflow-hidden">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase">Preferences</Text>
          </View>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
                <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
              </View>
              <Text className="text-base text-gray-900 font-normal">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                <Ionicons name="language-outline" size={20} color="#F97316" />
              </View>
              <Text className="text-base text-gray-900 font-normal">Language</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray-500 font-normal">English</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="moon-outline" size={20} color="#6B7280" />
              </View>
              <Text className="text-base text-gray-900 font-normal">Dark Mode</Text>
            </View>
            <View className="w-12 h-7 bg-gray-300 rounded-full p-1">
              <View className="w-5 h-5 bg-white rounded-full" />
            </View>
          </TouchableOpacity> */}
        </View>

        <View className="bg-white mx-4 mb-4 rounded-lg overflow-hidden">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase">Support</Text>
          </View>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="help-circle-outline" size={20} color="#2563EB" />
              </View>
              <Text className="text-base text-gray-900 font-normal">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center">
                <Ionicons name="document-text-outline" size={20} color="#4F46E5" />
              </View>
              <Text className="text-base text-gray-900 font-normal">Terms & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center">
                <Ionicons name="information-circle-outline" size={20} color="#14B8A6" />
              </View>
              <Text className="text-base text-gray-900 font-normal">About EyeSOS</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="mx-4 mb-6">
          <TouchableOpacity onPress={handleSignOut} className="bg-white border border-[#E63946] py-4 rounded-lg active:bg-red-50">
            <Text className="text-[#E63946] font-semibold text-center text-base">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center pb-6">
          <Text className="text-sm text-gray-400 font-normal">Version 1.0.0</Text>
        </View>
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

      {/* My Location Modal */}
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseLocationModal}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">My Location</Text>
              <TouchableOpacity onPress={handleCloseLocationModal} className="p-1">
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4">
              {isLoadingLocation ? (
                <View className="py-12 items-center justify-center">
                  <ActivityIndicator size="large" color="#7C3AED" />
                  <Text className="text-gray-600 mt-4">Getting your location...</Text>
                </View>
              ) : userLocation ? (
                <View className="gap-4">
                  <View className="items-center mb-4">
                    <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-3">
                      <Ionicons name="location" size={40} color="#7C3AED" />
                    </View>
                    <Text className="text-lg font-semibold text-gray-900">Current Location</Text>
                  </View>

                  <View className="bg-gray-50 rounded-lg p-4 mb-4">
                    <Text className="text-sm font-medium text-gray-500 mb-2">Full Address</Text>
                    <Text className="text-base text-gray-900 font-normal leading-6">
                      {userLocation.full_address || 'Address not available'}
                    </Text>
                  </View>

                  {userLocation.address && (
                    <View className="bg-gray-50 rounded-lg p-4">
                      <Text className="text-sm font-medium text-gray-500 mb-3">Location Details</Text>
                      <View className="gap-2">
                        {userLocation.address.street && (
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="map-outline" size={18} color="#7C3AED" />
                            <Text className="text-sm text-gray-700">
                              <Text className="font-medium">Street: </Text>
                              {userLocation.address.street} {userLocation.address.streetNumber || ''}
                            </Text>
                          </View>
                        )}
                        {userLocation.address.city && (
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="business-outline" size={18} color="#7C3AED" />
                            <Text className="text-sm text-gray-700">
                              <Text className="font-medium">City: </Text>
                              {userLocation.address.city}
                            </Text>
                          </View>
                        )}
                        {userLocation.address.region && (
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="location-outline" size={18} color="#7C3AED" />
                            <Text className="text-sm text-gray-700">
                              <Text className="font-medium">Region: </Text>
                              {userLocation.address.region}
                            </Text>
                          </View>
                        )}
                        {userLocation.address.country && (
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="globe-outline" size={18} color="#7C3AED" />
                            <Text className="text-sm text-gray-700">
                              <Text className="font-medium">Country: </Text>
                              {userLocation.address.country}
                            </Text>
                          </View>
                        )}
                        {userLocation.address.postalCode && (
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="mail-outline" size={18} color="#7C3AED" />
                            <Text className="text-sm text-gray-700">
                              <Text className="font-medium">Postal Code: </Text>
                              {userLocation.address.postalCode}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  <View className="bg-blue-50 rounded-lg p-4 mt-2">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons name="navigate-outline" size={18} color="#2563EB" />
                      <Text className="text-sm font-medium text-blue-900">Coordinates</Text>
                    </View>
                    <Text className="text-xs text-blue-700 font-mono">
                      Latitude: {userLocation.latitude.toFixed(6)}
                    </Text>
                    <Text className="text-xs text-blue-700 font-mono">
                      Longitude: {userLocation.longitude.toFixed(6)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{ marginBottom: insets.bottom }}
                    onPress={getCurrentLocation}
                    className="mt-4 bg-purple-600 py-3 rounded-lg active:bg-purple-700 flex-row items-center justify-center gap-2"
                  >
                    <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                    <Text className="text-white font-semibold">Refresh Location</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="py-12 items-center justify-center">
                  <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="location-outline" size={40} color="#9CA3AF" />
                  </View>
                  <Text className="text-gray-600 text-center mb-4">
                    No location data available
                  </Text>
                  <TouchableOpacity
                    onPress={getCurrentLocation}
                    className="bg-purple-600 px-6 py-3 rounded-lg active:bg-purple-700"
                  >
                    <Text className="text-white font-semibold">Get Location</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}