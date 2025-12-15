import OverlayLoading from "@/components/OverlayLoading";
import { useGetProfilesQuery } from "@/feature/auth/api/authApi";
import { useGetReportsQuery, useSendReportMutation } from "@/feature/home/api/homeApi";
import ChatModal from "@/feature/home/components/ChatModal";
import ReportIncidentModal, { ReportData } from "@/feature/home/components/ReportIncidentModal";
import ReportsCard from "@/feature/home/components/ReportsCard";
import ReportViewDetails from "@/feature/home/components/ReportViewDetailsModal";
import { Report } from "@/feature/home/interface/get-reports.interface";
import { formatSmartDate } from "@/feature/home/utils/date";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { clearPhotoUri } from "@/lib/redux/state/photoSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth)
  const insets = useSafeAreaInsets()
  const REPORTS_LIMIT = 5;
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [, setHasPermission] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [page, setPage] = useState(1);

  const [userCurrentLocation, setUserCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    full_address: '',
    address: [] as unknown
  })

  // Get Profiles Users RTK QUERY 
  const { data: UserProfile, isLoading: UserProfileLoading } = useGetProfilesQuery({
    id: user.id
  })

  // Get Reports Accidents by User Id
  const {
    data: accidentsReports,
    isLoading: accidentsReportsLoading,
    isFetching: accidentsReportsFetching
  } = useGetReportsQuery({
    userId: user.id,
    page,
    limit: REPORTS_LIMIT
  })


  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (!user) return;

    setIsLoadingLocation(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to see your current location and find nearby rides.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
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

      setUserCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        full_address: cleanedAddress,
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
  }, [user]);

  useEffect(() => {
    if (user) {
      getCurrentLocation();
      setPage(1);
    }
  }, [user, getCurrentLocation]);

  const [sendReport, { isLoading }] = useSendReportMutation()

  const handleSubmitReport = async (data: ReportData) => {
    try {
      if (UserProfile) {
        await sendReport({
          imageUrl: data.photoUri ?? '',
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          reported_by: UserProfile?.profile.id,
          reporter_contact: UserProfile?.profile.mobileNo,
          reporter_name: UserProfile.profile.name,
          severity: data.severity,
          reporter_notes: data.description,
          location_address: data.location.full_address
        }).unwrap()
        setReportModalVisible(false);
        dispatch(clearPhotoUri())
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    }
  }

  const handleReportPress = (report: Report) => {
    setSelectedReport(report);
  };
  const handleCloseModal = () => {
    setTimeout(() => setSelectedReport(null), 300);
  };

  const handleNextReportsPage = () => {
    if (accidentsReports?.meta.pagination.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevReportsPage = () => {
    if (accidentsReports?.meta.pagination.hasPrevious) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  };

  // Loading First load
  const isInitialLoading =
    (UserProfileLoading ||
      accidentsReportsLoading ||
      isLoadingLocation);

  return (
    <GestureHandlerRootView className='flex-1 bg-white'>
      <View className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-100" style={{ marginTop: insets.top }}>
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 bg-[#E63946] rounded-lg items-center justify-center">
              <Text className="text-white text-xl font-bold">E</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">EyeSOS</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Ionicons name="notifications-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="bg-[#E63946] mx-4 mt-6 mb-6 p-6 rounded-lg">
            <Text className="text-2xl font-bold text-white mb-2">Report an Incident</Text>
            <Text className="text-white opacity-90">
              See a disaster or emergency? Take a photo and send it directly to MDRRMC for immediate response.
            </Text>
          </View>

          <View className="mx-4 mb-4">
            <TouchableOpacity
              onPress={() => setReportModalVisible(true)}
              className="bg-[#E63946] active:bg-[#D32F2F] py-4 rounded-lg flex-row items-center justify-center gap-2 shadow-lg"
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-semibold text-base">Report Incident Now</Text>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mb-6">
            <TouchableOpacity
              onPress={() => router.push('/(root)/alert')}
              className="bg-white border-2 border-[#E63946] py-4 rounded-lg flex-row items-center justify-center gap-2 shadow-sm active:bg-red-50"
            >
              <Ionicons name="alert-circle" size={24} color="#E63946" />
              <Text className="text-[#E63946] font-semibold text-base">Send Emergency Alert</Text>
            </TouchableOpacity>
          </View>

          <ReportsCard
            formatSmartDate={formatSmartDate}
            accidentsReports={accidentsReports}
            onReportPress={handleReportPress}
            onNextPage={handleNextReportsPage}
            onPrevPage={handlePrevReportsPage}
            isPaginating={accidentsReportsFetching}
          />

          <View className="bg-white mx-4 mb-6 rounded-lg shadow-sm">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">Emergency Contacts</Text>
            </View>
            <View className="p-4 gap-3">
              <TouchableOpacity className="flex-row items-center justify-between p-3 bg-red-50 rounded-lg active:bg-red-100">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-[#E63946] rounded-full items-center justify-center">
                    <Ionicons name="call" size={20} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900">Emergency Hotline</Text>
                    <Text className="text-sm text-gray-600">911</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-3 bg-blue-50 rounded-lg active:bg-blue-100">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
                    <Ionicons name="call" size={20} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900">MDRRMC Office</Text>
                    <Text className="text-sm text-gray-600">143</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <ReportIncidentModal
          onClose={() => setReportModalVisible(false)}
          visible={reportModalVisible}
          onRoute={() => router.push('/(root)/camera')}
          location={userCurrentLocation}
          onSubmit={handleSubmitReport}
          isLoading={isLoading}
        />

        <ChatModal
          onClose={() => setChatModalVisible(false)}
          visible={chatModalVisible}
        />

        <ReportViewDetails
          report={selectedReport}
          formatSmartDate={formatSmartDate}
          onClose={handleCloseModal}
        />

        {isInitialLoading && <OverlayLoading />}
      </View>
    </GestureHandlerRootView>
  );
}