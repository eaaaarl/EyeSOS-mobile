import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { Report, ReportsResponse } from "../interface/get-reports.interface";

interface ReportsProps {
  accidentsReports?: ReportsResponse;
  formatSmartDate: (date: string) => string;
  onReportPress?: (report: Report) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  isPaginating?: boolean;
}

const getSeverityConfig = (severity: Report["severity"]) => {
  const configs = {
    minor: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "alert-circle-outline" as const,
      iconColor: "#2563eb",
      label: "Minor"
    },
    moderate: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      icon: "warning-outline" as const,
      iconColor: "#d97706",
      label: "Moderate"
    },
    high: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: "alert-outline" as const,
      iconColor: "#ea580c",
      label: "High"
    },
    critical: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "alert-circle" as const,
      iconColor: "#dc2626",
      label: "Critical"
    }
  };
  return configs[severity];
};

const ImageWithSkeleton = ({ uri, count }: { uri: string; count: number }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View className="relative">
      {isLoading && (
        <View
          className="absolute inset-0 bg-gray-200 rounded-lg items-center justify-center"
          style={{ width: 96, height: 96 }}
        >
          <ActivityIndicator size="small" color="#9ca3af" />
        </View>
      )}
      <Image
        source={{ uri }}
        className="rounded-lg"
        style={{ width: 96, height: 96 }}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {count > 1 && (
        <View
          className="absolute rounded-full flex-row items-center"
          style={{
            bottom: 8,
            right: 8,
            paddingHorizontal: 8,
            paddingVertical: 2,
            gap: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
        >
          <Ionicons name="images" size={10} color="white" />
          <Text className="text-white text-xs font-semibold">
            {count}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function ReportsCard({
  accidentsReports,
  formatSmartDate,
  onReportPress,
  onNextPage,
  onPrevPage,
  isPaginating
}: ReportsProps) {
  const reports = accidentsReports?.reports || [];
  const pagination = accidentsReports?.meta.pagination;
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalCount = pagination?.totalCount ?? reports.length;
  const hasNext = pagination?.hasNext ?? false;
  const hasPrevious = pagination?.hasPrevious ?? false;
  const showPaginationControls = totalPages > 1;

  if (reports.length === 0) {
    return (
      <View className="bg-white rounded-xl shadow-sm" style={{ marginHorizontal: 16, marginBottom: 24 }}>
        <View className="items-center justify-center" style={{ padding: 32 }}>
          <View className="bg-gray-100 rounded-full items-center justify-center" style={{ width: 64, height: 64, marginBottom: 12 }}>
            <Ionicons name="document-text-outline" size={32} color="#9ca3af" />
          </View>
          <Text className="text-base font-semibold text-gray-900" style={{ marginBottom: 4 }}>No Reports Yet</Text>
          <Text className="text-sm text-gray-500 text-center">
            Your submitted accident reports will appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ marginHorizontal: 16, marginBottom: 24 }}>
      <View className="bg-gray-50 border-b border-gray-100 flex-row items-center justify-between" style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <View className="bg-red-50 rounded-lg items-center justify-center" style={{ width: 32, height: 32 }}>
            <Ionicons name="document-text" size={18} color="#E63946" />
          </View>
          <Text className="text-lg font-bold text-gray-900">My Reports</Text>
        </View>
        <View className="bg-gray-100 rounded-full" style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text className="text-xs text-gray-700 font-bold">
            {totalCount} {totalCount === 1 ? 'report' : 'reports'}
          </Text>
        </View>
      </View>

      {reports.map((report, index) => {
        const severityConfig = getSeverityConfig(report.severity);
        return (
          <TouchableOpacity
            key={report.id}
            onPress={() => onReportPress?.(report)}
            activeOpacity={0.7}
            className={index !== reports.length - 1 ? "border-b border-gray-100" : ""}
            style={{ padding: 16 }}
          >
            <View className="flex-row" style={{ gap: 14 }}>
              <ImageWithSkeleton
                uri={report.imageUrl[0]}
                count={report.imageUrl.length}
              />

              <View className="flex-1">
                <View className="flex-row items-start justify-between" style={{ marginBottom: 8 }}>
                  <View className="flex-1" style={{ paddingRight: 4 }}>
                    <Text className="text-base font-bold text-gray-900" style={{ marginBottom: 2 }}>
                      Road Accident
                    </Text>
                    <Text style={{ lineHeight: 16 }} className="text-xs text-gray-500">
                      ID: {report.report_number}
                    </Text>
                  </View>
                  <View
                    className={`${severityConfig.bg} ${severityConfig.border} border rounded-full flex-row items-center`}
                    style={{ paddingHorizontal: 10, paddingVertical: 4, gap: 4 }}
                  >
                    <Ionicons
                      name={severityConfig.icon}
                      size={12}
                      color={severityConfig.iconColor}
                    />
                    <Text className={`text-xs font-semibold ${severityConfig.text}`}>
                      {severityConfig.label}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start" style={{ gap: 6, marginBottom: 8 }}>
                  <Ionicons
                    name="location"
                    size={14}
                    color="#6b7280"
                    style={{ marginTop: 1 }}
                  />
                  <Text className="text-xs text-gray-600 flex-1 leading-4" numberOfLines={2}>
                    {report.location_address}
                  </Text>
                </View>

                {report.reporter_notes && (
                  <Text className="text-sm text-gray-700 leading-5" style={{ marginBottom: 8 }} numberOfLines={2}>
                    {report.reporter_notes}
                  </Text>
                )}

                <View className="flex-row items-center justify-between" style={{ marginTop: 4 }}>
                  <View className="flex-row items-center" style={{ gap: 4 }}>
                    <Ionicons name="time-outline" size={13} color="#9ca3af" />
                    <Text className="text-xs text-gray-500 font-medium">
                      {formatSmartDate(report.created_at)}
                    </Text>
                  </View>

                  <View className="flex-row items-center" style={{ gap: 4 }}>
                    <Text className="text-xs text-gray-400">Tap to view</Text>
                    <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {showPaginationControls && (
        <View className="border-t border-gray-100 flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={onPrevPage}
            disabled={!hasPrevious || isPaginating}
            className={`flex-row items-center px-3 py-2 rounded-full ${(!hasPrevious || isPaginating) ? "opacity-50" : ""}`}
            style={{ gap: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={16} color="#1f2937" />
            <Text className="text-sm font-semibold text-gray-700">Previous</Text>
          </TouchableOpacity>

          <View className="flex-row items-center" style={{ gap: 8 }}>
            {isPaginating && <ActivityIndicator size="small" color="#9ca3af" />}
            <Text className="text-xs text-gray-500 font-semibold">
              Page {page} of {Math.max(totalPages, 1)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onNextPage}
            disabled={!hasNext || isPaginating}
            className={`flex-row items-center px-3 py-2 rounded-full ${(!hasNext || isPaginating) ? "opacity-50" : ""}`}
            style={{ gap: 8 }}
            activeOpacity={0.7}
          >
            <Text className="text-sm font-semibold text-gray-700">Next</Text>
            <Ionicons name="chevron-forward" size={16} color="#1f2937" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}