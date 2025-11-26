import ChatModal from "@/feature/home/components/ChatModal";
import ReportIncidentModal, { ReportData } from "@/feature/home/components/ReportIncidentModal";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { clearPhotoUri } from "@/lib/redux/state/photoSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth)
  const insets = useSafeAreaInsets()
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [userCurrentLocation, setUserCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: ''
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

      setUserCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0]?.street || address[0]?.city || address[0]?.name || 'Unknown location'
      })

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
    }
  }, [user, getCurrentLocation]);


  const handleSubmitReport = async (data: ReportData) => {
    try {
      console.log('Report Data:', data);
      alert('Report submitted successfully!');

      setReportModalVisible(false);
      dispatch(clearPhotoUri())
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    }
  }


  const reports = [
    {
      id: 1,
      title: "Street Flooding",
      location: "Lianga, Surigao Del Sur",
      time: "2 hours ago",
      status: "Under Review",
      statusColor: "bg-yellow-100",
      statusTextColor: "text-yellow-800",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUGPe6qvJr0369R1iFkaGhDx6LDEa1bjrAuA&s",
      description: "Water level reaching knee height at Commonwealth Ave.",
      messages: 2,
    },
    {
      id: 2,
      title: "House Fire",
      location: "Lianga, Surigao Del Sur",
      time: "5 hours ago",
      status: "Resolved",
      statusColor: "bg-green-100",
      statusTextColor: "text-green-800",
      image: "https://cdn.sanity.io/images/ycvw0l8e/production/b60207faf3c300ab95d4d67eccc3175c1e74da9d-4800x2700.jpg",
      description: "Fire at residential area, smoke visible from street.",
      messages: 8,
    },
    {
      id: 3,
      title: "Road Blockage",
      location: "Lianga, Surigao Del Sur",
      time: "1 day ago",
      status: "In Progress",
      statusColor: "bg-blue-100",
      statusTextColor: "text-blue-800",
      image: "https://media.philstar.com/images/articles/gen11-otis-bridge-eddgumban2018-06-2722-44-58_2018-09-05_12-40-12.jpg",
      description: "Fallen tree blocking the main road after heavy rain.",
      messages: 5,
    },
  ];

  return (
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

        <View className="bg-white mx-4 mb-6 rounded-lg shadow-sm">
          <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">My Reports</Text>
            <Text className="text-sm text-gray-600 font-semibold">3 active</Text>
          </View>

          {reports.map((report, index) => (
            <View
              key={report.id}
              className={`p-4 ${index !== reports.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              <View className="flex-row gap-4">
                <Image
                  source={{ uri: report.image }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <View className="flex-row items-start justify-between mb-1">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">{report.title}</Text>
                      <Text className="text-xs text-gray-500">
                        {report.location} • {report.time}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 ${report.statusColor} rounded-full ml-2`}>
                      <Text className={`text-xs font-medium ${report.statusTextColor}`}>
                        {report.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-600 mb-2">{report.description}</Text>
                  <TouchableOpacity
                    onPress={() => setChatModalVisible(true)}
                    className="flex-row items-center gap-1"
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#E63946" />
                    <Text className="text-sm text-[#E63946] font-medium">
                      View Messages ({report.messages})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

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
      />

      <ChatModal
        onClose={() => setChatModalVisible(false)}
        visible={chatModalVisible}
      />
    </View>
  );
}