import { useGetProfilesQuery, useSignOutMutation } from '@/feature/auth/api/authApi';
import { useGetReportsQuery } from '@/feature/home/api/homeApi';
import LocationModalScreen from '@/feature/profile/components/location-modal';
import PersonalInformationModal from '@/feature/profile/components/personal-information-modal';
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

  // Personal Information Modal State
  const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);

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

  const handleOpenPersonalInfoModal = () => {
    setPersonalInfoModalVisible(true);
  };

  const handleClosePersonalInfoModal = () => {
    setPersonalInfoModalVisible(false);
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

          <TouchableOpacity 
            className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50"
            onPress={handleOpenPersonalInfoModal}
          >
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
      <LocationModalScreen
        getCurrentLocation={getCurrentLocation}
        isLoading={isLoadingLocation}
        onClose={handleCloseLocationModal}
        userLocation={userLocation}
        visible={locationModalVisible}
      />

      {/* Personal Information Modal */}
      <PersonalInformationModal
        isLoading={isLoading}
        onClose={handleClosePersonalInfoModal}
        userProfile={user?.profile || null}
        visible={personalInfoModalVisible}
      />
        
    </View>
  );
}