
export interface sendEmergencyReportPayload {
  reported_by: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  name: string;
  mobileNo: string;
  location: string;
  latitude: number;
  longitude: number;
  details: string;
}