import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearPhotoUri } from '@/lib/redux/state/photoSlice';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const dispatch = useAppDispatch()
  const { photoUri } = useAppSelector((state) => state.photo)
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('minor');
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  const handleSubmit = () => {
    const reportData: ReportData = {
      photoUri: photoUri,
      description,
      severity,
      location
    };
    onSubmit(reportData);
    setDescription('');
    setSeverity('minor');
  };

  const selectedSeverity = severityOptions.find(opt => opt.value === severity);

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
            <Text className="text-lg font-bold text-gray-900">Report Incident</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-4">
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Upload Photo</Text>
                {photoUri ? (
                  <View className="relative">
                    <Image
                      source={{ uri: photoUri }}
                      className="w-full h-48 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => dispatch(clearPhotoUri())}
                      className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
                    >
                      <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={onRoute}
                      className="absolute top-3 left-3 bg-[#E63946] rounded-full px-3 py-2 flex-row items-center gap-1"
                    >
                      <Ionicons name="camera" size={16} color="white" />
                      <Text className="text-white text-xs font-semibold">Retake</Text>
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
                  className="px-4 py-3 border border-gray-300 rounded-lg min-h-[100px]"
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
              >
                <Text className="text-white font-semibold">Submit Report</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}