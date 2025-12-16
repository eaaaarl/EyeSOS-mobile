export interface SendReportPayload {
  severity: "minor" | "moderate" | "high" | "critical";
  reported_by: string;
  reporter_name: string;
  reporter_notes?: string;
  reporter_contact?: string;
  latitude: number;
  longitude: number;
  location_address?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  landmark?: string;
  imageUrl?: string;
}
