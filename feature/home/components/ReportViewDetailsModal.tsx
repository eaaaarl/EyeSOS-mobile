import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { Report } from '../interface/get-reports.interface';

interface ReportViewDetailsProps {
  report: Report | null;
  isVisible: boolean;
  onClose: () => void;
  formatSmartDate: (date: string) => string;
}

const { width } = Dimensions.get('window');

const getSeverityConfig = (severity: Report["severity"]) => {
  const configs = {
    minor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'alert-circle-outline' as const,
      iconColor: '#2563eb',
      label: 'Minor'
    },
    moderate: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'warning-outline' as const,
      iconColor: '#d97706',
      label: 'Moderate'
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'alert-outline' as const,
      iconColor: '#ea580c',
      label: 'High'
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'alert-circle' as const,
      iconColor: '#dc2626',
      label: 'Critical'
    }
  };
  return configs[severity];
};

export default function ReportViewDetails({
  report,
  isVisible,
  onClose,
  formatSmartDate
}: ReportViewDetailsProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  if (!report) return null;

  const severityConfig = getSeverityConfig(report.severity);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints || ["40%", "90%"]}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: '#f9fafb' }}
      handleIndicatorStyle={{ backgroundColor: '#9ca3af', width: 40, height: 4 }}
    >
      <BottomSheetScrollView className="flex-1" style={{ backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <View className="border-b border-gray-200 bg-white" style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-2xl font-bold text-gray-900" style={{ marginBottom: 4 }}>Report Details</Text>
              <Text className="text-sm text-gray-500 font-medium">ID: {report.report_number}</Text>
            </View>
            <View className={`${severityConfig.bg} ${severityConfig.border} border flex-row items-center rounded-full`} style={{ paddingHorizontal: 12, paddingVertical: 6, gap: 6 }}>
              <Ionicons
                name={severityConfig.icon}
                size={16}
                color={severityConfig.iconColor}
              />
              <Text className={`text-sm font-semibold ${severityConfig.text}`}>
                {severityConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Images Gallery */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text className="text-base font-bold text-gray-900" style={{ marginBottom: 12 }}>Images</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 20 }}
          >
            {report.imageUrl.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                className="rounded-lg bg-gray-100"
                style={{ width: width, height: 240 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View className="flex-row items-center" style={{ gap: 8, marginBottom: 12 }}>
            <Ionicons name="location" size={20} color="#E63946" />
            <Text className="text-base font-bold text-gray-900">Location</Text>
          </View>
          <View className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: 16, backgroundColor: '#ffffff' }}>
            <Text className="text-sm text-gray-700" style={{ lineHeight: 20 }}>{report.location_address}</Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View className="flex-row items-center" style={{ gap: 8, marginBottom: 12 }}>
            <Ionicons name="calendar-outline" size={20} color="#E63946" />
            <Text className="text-base font-bold text-gray-900">Reported On</Text>
          </View>
          <View className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: 16 }}>
            <Text className="text-sm text-gray-700" style={{ lineHeight: 20 }}>{formatSmartDate(report.created_at)}</Text>
          </View>
        </View>

        {/* Reporter Notes */}
        {report.reporter_notes && (
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <View className="flex-row items-center" style={{ gap: 8, marginBottom: 12 }}>
              <Ionicons name="document-text-outline" size={20} color="#E63946" />
              <Text className="text-base font-bold text-gray-900">Reporter Notes</Text>
            </View>
            <View className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: 16 }}>
              <Text className="text-sm text-gray-700" style={{ lineHeight: 22 }}>{report.reporter_notes}</Text>
            </View>
          </View>
        )}

        {/* Additional Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View className="flex-row items-center" style={{ gap: 8, marginBottom: 12 }}>
            <Ionicons name="information-circle-outline" size={20} color="#E63946" />
            <Text className="text-base font-bold text-gray-900">Report Information</Text>
          </View>
          <View className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: 16 }}>
            <View className="flex-row justify-between items-center" style={{ paddingVertical: 8 }}>
              <Text className="text-sm text-gray-600 font-medium">Report Type:</Text>
              <Text className="text-sm text-gray-900 font-semibold">Road Accident</Text>
            </View>
            <View style={{ height: 1 }} className="bg-gray-200" />
            <View className="flex-row justify-between items-center" style={{ paddingVertical: 8 }}>
              <Text className="text-sm text-gray-600 font-medium">Severity Level:</Text>
              <Text className={`text-sm font-semibold ${severityConfig.text}`}>
                {severityConfig.label}
              </Text>
            </View>
            <View style={{ height: 1 }} className="bg-gray-200" />
            <View className="flex-row justify-between items-center" style={{ paddingVertical: 8 }}>
              <Text className="text-sm text-gray-600 font-medium">Total Images:</Text>
              <Text className="text-sm text-gray-900 font-semibold">{report.imageUrl.length}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}