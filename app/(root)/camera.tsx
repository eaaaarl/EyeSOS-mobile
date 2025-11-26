import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Camera() {
  const insets = useSafeAreaInsets();

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-[#E63946] rounded-full items-center justify-center mb-6">
            <Ionicons name="camera" size={48} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Camera Permission Required
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            We need access to your camera to take photos of incidents and send them to MDRRMC.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-[#E63946] px-8 py-4 rounded-full"
          >
            <Text className="text-white font-bold text-base">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        console.log('photo take picture', photo)
        setPhoto(photo?.uri || null);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const usePhoto = () => {
    // Navigate to report screen with photo
    Alert.alert('Success', 'Photo will be used for incident report');
    // TODO: Navigate to report screen with photo URI
    console.log('photo uri', photo)

  };

  if (photo) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: photo }} className="flex-1" resizeMode="contain" />
        <SafeAreaView className="absolute top-0 left-0 right-0">
          <View className="px-4 py-3">
            <TouchableOpacity
              onPress={retakePhoto}
              className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Bottom Actions */}
        <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0">
          <View className="bg-black/70 px-6 py-6">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={retakePhoto}
                className="flex-1 bg-white/20 py-4 rounded-full border border-white/30"
              >
                <Text className="text-white font-bold text-center text-base">Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={usePhoto}
                className="flex-1 bg-[#E63946] py-4 rounded-full"
              >
                <Text className="text-white font-bold text-center text-base">Use Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }


  return (
    <View className="flex-1 bg-black">
      {/* Header - Outside CameraView */}
      <SafeAreaView className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <View className="bg-black/50 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">Incident Report</Text>
          </View>

          <TouchableOpacity
            onPress={toggleFlash}
            className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
          >
            <Ionicons
              name={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
              color={flash === 'on' ? '#FCD34D' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Camera View - Full screen */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        enableTorch={flash === 'on'}
      />

      {/* Guide Overlay - Absolute positioned over camera */}
      <View className="absolute inset-0 justify-center items-center px-8 pointer-events-none">
        <View className="border-2 border-white/30 border-dashed rounded-2xl w-full aspect-[4/3] items-center justify-center">
          <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.3)" />
          <Text className="text-white/60 text-sm mt-4 text-center">
            Frame the incident in the viewfinder
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0 z-10">
        <View className="px-6 pb-6">
          {/* Instructions */}
          <View className="bg-black/50 rounded-lg px-4 py-3 mb-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="information-circle" size={20} color="#60A5FA" />
              <Text className="text-white text-sm flex-1">
                Take a clear photo of the incident to help responders
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="w-16" />

            <TouchableOpacity
              onPress={takePicture}
              className="w-20 h-20 rounded-full bg-white items-center justify-center border-4 border-gray-300"
            >
              <View className="w-16 h-16 rounded-full bg-white border-4 border-[#E63946]" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="w-16 h-16 bg-black/50 rounded-full items-center justify-center"
            >
              <Ionicons name="camera-reverse" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}