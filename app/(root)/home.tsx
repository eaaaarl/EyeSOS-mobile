import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets()
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [emergencyCallVisible, setEmergencyCallVisible] = useState(false);
  const [callConnecting, setCallConnecting] = useState(false);

  const reports = [
    {
      id: 1,
      title: "Street Flooding",
      location: "Quezon City",
      time: "2 hours ago",
      status: "Under Review",
      statusColor: "bg-yellow-100",
      statusTextColor: "text-yellow-800",
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400",
      description: "Water level reaching knee height at Commonwealth Ave.",
      messages: 2,
    },
    {
      id: 2,
      title: "House Fire",
      location: "Makati City",
      time: "5 hours ago",
      status: "Resolved",
      statusColor: "bg-green-100",
      statusTextColor: "text-green-800",
      image: "https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=400",
      description: "Fire at residential area, smoke visible from street.",
      messages: 8,
    },
    {
      id: 3,
      title: "Road Blockage",
      location: "Baguio City",
      time: "1 day ago",
      status: "In Progress",
      statusColor: "bg-blue-100",
      statusTextColor: "text-blue-800",
      image: "https://images.unsplash.com/photo-1592500595497-534a3f6bffd2?w=400",
      description: "Fallen tree blocking the main road after heavy rain.",
      messages: 5,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-100" style={{ marginTop: insets.top }}>
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 bg-[#E63946] rounded-lg items-center justify-center">
            <Text className="text-white text-xl font-bold">D</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">DisasterEye</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
          <Ionicons name="notifications-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Welcome Banner */}
        <View className="bg-[#E63946] mx-4 mt-6 mb-6 p-6 rounded-lg">
          <Text className="text-2xl font-bold text-white mb-2">Report an Incident</Text>
          <Text className="text-white opacity-90">
            See a disaster or emergency? Take a photo and send it directly to MDRRMC for immediate response.
          </Text>
        </View>

        {/* Alert Banner */}
        <View className="bg-yellow-50 border-l-4 border-yellow-400 mx-4 mb-6 p-4 rounded-r-lg">
          <View className="flex-row items-start">
            <Ionicons name="warning" size={24} color="#F59E0B" style={{ marginRight: 12 }} />
            <View className="flex-1">
              <Text className="font-semibold text-yellow-800">Tropical Storm Warning</Text>
              <Text className="text-sm text-yellow-700 mt-1">
                Heavy rainfall expected in Metro Manila. Stay updated and prepare emergency supplies.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Report Button */}
        <View className="mx-4 mb-4">
          <TouchableOpacity
            onPress={() => setReportModalVisible(true)}
            className="bg-[#E63946] active:bg-[#D32F2F] py-4 rounded-lg flex-row items-center justify-center gap-2 shadow-lg"
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text className="text-white font-semibold text-base">Report Incident Now</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Call Button */}
        <View className="mx-4 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/(root)/alert')}
            className="bg-white border-2 border-[#E63946] py-4 rounded-lg flex-row items-center justify-center gap-2 shadow-sm active:bg-red-50"
          >
            <Ionicons name="alert-circle" size={24} color="#E63946" />
            <Text className="text-[#E63946] font-semibold text-base">Send Emergency Alert</Text>
          </TouchableOpacity>
        </View>

        {/* My Reports */}
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

        {/* Emergency Contacts */}
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

      {/* Report Modal */}
      <Modal
        visible={reportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Report Incident</Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)} className="p-1">
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4">
              <View className="gap-4">
                {/* Photo Upload */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Upload Photo</Text>
                  <TouchableOpacity onPress={() => router.push('/(root)/camera')} className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center active:border-[#E63946]">
                    <Ionicons name="camera" size={48} color="#9CA3AF" />
                    <Text className="text-sm text-gray-600 mt-2 font-semibold">
                      Click to take photo or upload image
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Location */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1 px-4 py-3 border border-gray-300 rounded-lg">
                      <Text className="text-gray-500">Address or location</Text>
                    </View>
                    <TouchableOpacity className="px-4 py-3 bg-gray-100 active:bg-gray-200 rounded-lg">
                      <Ionicons name="location" size={20} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    Your coordinates will be automatically sent to MDRRMC
                  </Text>
                </View>

                {/* Description */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                  <View className="px-4 py-3 border border-gray-300 rounded-lg min-h-[100px]">
                    <Text className="text-gray-500">Describe what you see...</Text>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity className="bg-[#E63946] active:bg-[#D32F2F] py-3 rounded-lg items-center">
                  <Text className="text-white font-semibold">Send Report to MDRRMC</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Chat Modal */}
      <Modal
        visible={chatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-[80%]">
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <View>
                <Text className="font-bold text-gray-900">MDRRMC Response Team</Text>
                <Text className="text-xs text-green-600">● Online</Text>
              </View>
              <TouchableOpacity onPress={() => setChatModalVisible(false)} className="p-1">
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4 bg-gray-50">
              {/* MDRRMC Message */}
              <View className="flex-row gap-2 mb-4">
                <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-semibold">MD</Text>
                </View>
                <View className="flex-1">
                  <View className="bg-white rounded-lg p-3 shadow-sm">
                    <Text className="text-sm text-gray-900">
                      Thank you for your report. We have received your location and photo. Our team is
                      assessing the situation.
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">2 hours ago</Text>
                </View>
              </View>

              {/* User Message */}
              <View className="flex-row justify-end mb-4">
                <View className="items-end max-w-[80%]">
                  <View className="bg-[#E63946] rounded-lg p-3 shadow-sm">
                    <Text className="text-sm text-white">
                      The water level is rising quickly. Several cars are stuck.
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">1 hour ago</Text>
                </View>
              </View>

              {/* MDRRMC Message */}
              <View className="flex-row gap-2 mb-4">
                <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-semibold">MD</Text>
                </View>
                <View className="flex-1">
                  <View className="bg-white rounded-lg p-3 shadow-sm">
                    <Text className="text-sm text-gray-900">
                      Emergency response team has been dispatched to your location. ETA 15 minutes.
                      Please stay in a safe area.
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">50 minutes ago</Text>
                </View>
              </View>
            </ScrollView>

            <View className="p-4 border-t border-gray-200">
              <View className="flex-row gap-2">
                <View className="flex-1 px-4 py-3 border border-gray-300 rounded-lg">
                  <Text className="text-gray-500">Type a message...</Text>
                </View>
                <TouchableOpacity className="px-4 py-3 bg-[#E63946] active:bg-[#D32F2F] rounded-lg items-center justify-center">
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}