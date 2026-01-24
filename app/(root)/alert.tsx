import { useSendEmergencyReportMutation } from '@/feature/alert/api/alertApi';
import {
  AdditionalDetailsSection,
  AlertHeader,
  AlertSentScreen,
  ImportantNotice,
  LocationSection,
  YourInformationSection,
  type UserLocation
} from '@/feature/alert/components';
import { useGetProfilesQuery } from '@/feature/auth/api/authApi';
import { useAppSelector } from '@/lib/redux/hooks';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Alert as RNAlert, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Alert() {
  const user = useAppSelector((state) => state.auth);
  const { data: userProfile, isLoading: userProfileLoading } = useGetProfilesQuery(
    { id: user.id },
    { skip: !user.id }
  );

  const insets = useSafeAreaInsets();
  const [alertSent, setAlertSent] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

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
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() },
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
        address: address[0],
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
  }, [user?.id]);

  const handleSendAlert = () => {
    RNAlert.alert(
      'Confirm Emergency Alert',
      'This will send your current location and details to MDRRMC. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => setAlertSent(true),
        },
      ]
    );
  };

  const [sendEmergencyReport, { isLoading }] = useSendEmergencyReportMutation()

  const handleConfirmAlert = async () => {
    try {

      await sendEmergencyReport({
        details: additionalDetails,
        emergency_contact_name: userProfile?.profile?.emergency_contact_name as string,
        emergency_contact_number: userProfile?.profile?.emergency_contact_number as string,
        latitude: userLocation?.latitude as number,
        location: userLocation?.full_address ?? '',
        longitude: userLocation?.longitude as number,
        mobileNo: userProfile?.profile?.mobileNo ?? '',
        name: userProfile?.profile?.name ?? '',
        reported_by: userProfile?.profile.id ?? ''
      })

      setAdditionalDetails('');
      setAlertSent(false);
      router.replace('/(root)/home')
    } catch (error) {
      console.log('error alert', error)
    }
  };

  const handleResetAndGoHome = () => {
    setAlertSent(false);
    setAdditionalDetails('');
    router.replace('/(root)/home');
  };

  if (alertSent) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#E63946" />
        <AlertSentScreen
          isLoading={isLoading}
          profile={userProfile?.profile}
          userLocation={userLocation}
          additionalDetails={additionalDetails}
          onPinLocation={handleConfirmAlert}
          onResetAndGoHome={handleResetAndGoHome}
          topInset={insets.top}
          bottomInset={insets.bottom}
        />
      </>
    );
  }

  const initialLoading = userProfileLoading || isLoadingLocation;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 0,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AlertHeader topInset={insets.top} />
        <YourInformationSection profile={userProfile?.profile} />
        <LocationSection location={userLocation} />
        <AdditionalDetailsSection value={additionalDetails} onChangeText={setAdditionalDetails} />
        <ImportantNotice />

        <TouchableOpacity
          onPress={handleSendAlert}
          className="bg-[#E63946] active:bg-[#D32F2F] py-4 rounded-full shadow-lg mb-4"
          disabled={isLoadingLocation || !userLocation}
        >
          <Text className="text-white font-bold text-lg text-center">
            {isLoadingLocation ? 'Getting your location...' : 'Send Emergency Alert'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3 border border-gray-200 rounded-full mb-4"
          onPress={() => router.replace('/(root)/home')}
        >
          <Text className="text-gray-500 font-medium text-center">Cancel</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Modal transparent visible={initialLoading} animationType="fade">
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
