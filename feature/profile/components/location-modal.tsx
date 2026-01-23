import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LocationModalScreenProps {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
  userLocation: {
    latitude: number;
    longitude: number;
    full_address: string;
    address: any;
  } | null;
  getCurrentLocation: () => void;
}

export default function LocationModalScreen({ visible, onClose, isLoading, userLocation, getCurrentLocation }: LocationModalScreenProps) {
  const insets = useSafeAreaInsets()
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">My Location</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="p-4"
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          >
            {isLoading ? (
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
                  style={styles.refreshButton}
                  onPress={getCurrentLocation}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.refreshButtonText}>Refresh Location</Text>
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
                  style={styles.getLocationButton}
                  onPress={getCurrentLocation}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getLocationButtonText}>Get Location</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  refreshButton: {
    marginTop: 16,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  getLocationButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  getLocationButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});