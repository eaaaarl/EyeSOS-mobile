import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearPhotoUri } from '@/lib/redux/state/photoSlice';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReportIncidentModalProps {
  visible: boolean;
  onClose: () => void;
  onRoute: () => void;
  onSubmit: (data: ReportData) => void;
  location: {
    latitude: number;
    longitude: number;
    full_address: string;
  }
  isLoading?: boolean
}

export type SeverityLevel = 'minor' | 'moderate' | 'high' | 'critical';

export interface ReportData {
  photoUri: string | null;
  description: string;
  severity: SeverityLevel;
  location: {
    latitude: number;
    longitude: number;
    full_address: string;
  };
}

const severityOptions = [
  { value: 'minor' as SeverityLevel, label: 'Minor', color: '#10B981', icon: 'information-circle' },
  { value: 'moderate' as SeverityLevel, label: 'Moderate', color: '#F59E0B', icon: 'warning' },
  { value: 'high' as SeverityLevel, label: 'High', color: '#EF4444', icon: 'alert-circle' },
  { value: 'critical' as SeverityLevel, label: 'Critical', color: '#DC2626', icon: 'skull' },
];

export default function ReportIncidentModal({ onClose, visible, onRoute, onSubmit, location, isLoading }: ReportIncidentModalProps) {
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const { photoUri } = useAppSelector((state) => state.photo)
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('minor');
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  useEffect(() => {
    if (!visible && !isLoading) {
      setDescription('');
      setSeverity('minor');
      dispatch(clearPhotoUri());
    }
  }, [visible, isLoading, dispatch]);

  const handleSubmit = () => {
    const reportData: ReportData = {
      photoUri: photoUri,
      description,
      severity,
      location
    };
    onSubmit(reportData);
  };

  const selectedSeverity = severityOptions.find(opt => opt.value === severity);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Report Incident</Text>
              <TouchableOpacity onPress={onClose} className="p-1">
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-4" >
              <View className="gap-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Upload Photo</Text>
                  {photoUri ? (
                    <View style={{ position: 'relative' }}>
                      <Image
                        source={{ uri: photoUri }}
                        style={{ width: '100%', height: 192, borderRadius: 8 }}
                        resizeMode="cover"
                      />

                      {/* Close button - top right */}
                      <TouchableOpacity
                        onPress={() => dispatch(clearPhotoUri())}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: 9999,
                          padding: 8,
                        }}
                      >
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>

                      {/* Retake button - top left */}
                      <TouchableOpacity
                        onPress={onRoute}
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: '#E63946',
                          borderRadius: 9999,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Ionicons name="camera" size={16} color="white" />
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                          Retake
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{ padding: 18 }}
                      onPress={onRoute}
                      className="border-2 border-dashed border-gray-300 rounded-lg items-center active:border-[#E63946]"
                    >
                      <Ionicons name="camera" size={48} color="#9CA3AF" />
                      <Text className="text-sm text-gray-600 mt-2 font-semibold">
                        Click to take photo or upload image
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Severity Level</Text>
                  <TouchableOpacity
                    onPress={() => setShowSeverityDropdown(!showSeverityDropdown)}
                    className="px-4 py-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2">
                      <Ionicons
                        name={selectedSeverity?.icon as any}
                        size={20}
                        color={selectedSeverity?.color}
                      />
                      <Text style={{ color: selectedSeverity?.color }} className="font-semibold">
                        {selectedSeverity?.label}
                      </Text>
                    </View>
                    <Ionicons
                      name={showSeverityDropdown ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>

                  {showSeverityDropdown && (
                    <View className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                      {severityOptions.map((option, index) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => {
                            setSeverity(option.value);
                            setShowSeverityDropdown(false);
                          }}
                          className={`px-4 py-3 flex-row items-center gap-3 ${index !== severityOptions.length - 1 ? 'border-b border-gray-200' : ''
                            } ${severity === option.value ? 'bg-gray-50' : 'bg-white'} active:bg-gray-100`}
                        >
                          <Ionicons name={option.icon as any} size={20} color={option.color} />
                          <Text style={{ color: option.color }} className="font-semibold flex-1">
                            {option.label}
                          </Text>
                          {severity === option.value && (
                            <Ionicons name="checkmark-circle" size={20} color={option.color} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text className="text-xs text-gray-500 mt-2">
                    {severity === 'minor' && 'Minor issue, no immediate danger'}
                    {severity === 'moderate' && 'Requires attention, potential risk'}
                    {severity === 'high' && 'Serious situation, urgent response needed'}
                    {severity === 'critical' && 'Life-threatening emergency, immediate action required'}
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1 px-4 py-3 border border-gray-300 rounded-lg">
                      <Text className="text-gray-500">{location.full_address}</Text>
                    </View>
                    <TouchableOpacity className="px-4 py-3 justify-center  bg-gray-100 active:bg-gray-200 rounded-lg">
                      <Ionicons className='items-center' name="location" size={24} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    latitude: {location.latitude}, longitude: {location.longitude}
                  </Text>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                  <TextInput
                    className="px-4 py-3 mb-4 border border-gray-300 rounded-lg min-h-[100px]"
                    placeholder="Describe what you see..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                <TouchableOpacity
                  className="bg-[#E63946] active:bg-[#D32F2F] py-3 rounded-lg items-center"
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={{ marginBottom: insets.bottom }}
                >
                  <Text className="text-white font-semibold p-3 text-lg">Submit Report</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {isLoading && (
        <Modal
          transparent
          visible={isLoading}
          animationType="fade"
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <View className="bg-white p-6 rounded-2xl items-center">
              <ActivityIndicator size="large" color="#E63946" />
              <Text className="mt-4 text-base text-gray-700 font-medium">
                Submitting Report...
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}