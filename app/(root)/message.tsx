import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Messages() {
  const insets = useSafeAreaInsets()
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'mdrrmc',
      text: 'Hello! Thank you for using DisasterEye. How can we assist you today?',
      time: '9:30 AM',
      date: 'Oct 10, 2025'
    },
    {
      id: 2,
      sender: 'user',
      text: 'I reported a flooding incident this morning.',
      time: '10:15 AM',
      date: 'Oct 10, 2025'
    },
    {
      id: 3,
      sender: 'mdrrmc',
      text: 'Thank you for your report. We have received your location and photo. Our team is assessing the situation.',
      time: '10:20 AM',
      date: 'Oct 10, 2025'
    },
    {
      id: 4,
      sender: 'user',
      text: 'The water level is rising quickly. Several cars are stuck.',
      time: '10:45 AM',
      date: 'Oct 10, 2025'
    },
    {
      id: 5,
      sender: 'mdrrmc',
      text: 'Emergency response team has been dispatched to your location. ETA 15 minutes. Please stay in a safe area.',
      time: '10:50 AM',
      date: 'Oct 10, 2025'
    },
    {
      id: 6,
      sender: 'user',
      text: 'Thank you! We can see the rescue team approaching now.',
      time: '11:05 AM',
      date: 'Oct 10, 2025'
    },
    {
      id: 7,
      sender: 'mdrrmc',
      text: 'Glad to hear that! Please follow the instructions of the rescue team. Stay safe.',
      time: '11:07 AM',
      date: 'Oct 10, 2025'
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100" style={{ marginTop: insets.top }}>
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center">
            <Ionicons name="shield-checkmark" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">MDRRMC Response Team</Text>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <Text className="text-sm text-green-600 font-normal">Online</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={28} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        <ScrollView className="flex-1 px-4 py-4">
          {/* Date Separator */}
          <View className="items-center mb-4">
            <View className="bg-gray-200 px-3 py-1 rounded-full">
              <Text className="text-xs text-gray-600 font-semibold">Today</Text>
            </View>
          </View>

          {/* Welcome Message */}
          <View className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
            <View className="flex-row items-start gap-2">
              <Ionicons name="information-circle" size={20} color="#2563EB" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-blue-900 mb-1">Official MDRRMC Channel</Text>
                <Text className="text-xs text-blue-800">
                  This is your direct line to the Municipal Disaster Risk Reduction and Management Council.
                  All your incident reports and emergency communications will be handled here.
                </Text>
              </View>
            </View>
          </View>

          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'mdrrmc' && (
                <View className="flex-row gap-2 max-w-[85%]">
                  <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">MD</Text>
                  </View>
                  <View>
                    <View className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                      <Text className="text-sm text-gray-900">{msg.text}</Text>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1 ml-1">{msg.time}</Text>
                  </View>
                </View>
              )}

              {msg.sender === 'user' && (
                <View className="max-w-[85%]">
                  <View className="bg-[#E63946] rounded-lg rounded-tr-none p-3 shadow-sm">
                    <Text className="text-sm text-white">{msg.text}</Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1 mr-1 text-right">{msg.time}</Text>
                </View>
              )}
            </View>
          ))}

          {/* Typing Indicator */}
          <View className="flex-row gap-2 max-w-[85%] mb-8">
            <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">MD</Text>
            </View>
            <View className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
              <View className="flex-row gap-1">
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          {/* Quick Actions */}
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 py-2 rounded-lg active:bg-gray-200">
              <Ionicons name="camera" size={18} color="#4B5563" />
              <Text className="text-sm text-gray-700 font-medium">Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 py-2 rounded-lg active:bg-gray-200">
              <Ionicons name="location" size={18} color="#4B5563" />
              <Text className="text-sm text-gray-700 font-medium">Location</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 py-2 rounded-lg active:bg-gray-200">
              <Ionicons name="alert-circle" size={18} color="#4B5563" />
              <Text className="text-sm text-gray-700 font-medium">Emergency</Text>
            </TouchableOpacity>
          </View>

          {/* Message Input */}
          <View className="flex-row gap-2 items-center">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-base text-gray-900"
                multiline
                maxLength={500}
              />
              <TouchableOpacity>
                <Ionicons name="happy-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="w-12 h-12 bg-[#E63946] rounded-full items-center justify-center active:bg-[#D32F2F] shadow-md"
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}