import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { sendEmergencyReportPayload } from "../interface/sendEmergencyReportPayload";


export const alertApi = createApi({
  reducerPath: 'alertApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    sendEmergencyReport: builder.mutation<{ meta: { success: boolean, message: string } }, sendEmergencyReportPayload>({
      queryFn: async ({ reported_by, details, emergency_contact_name, emergency_contact_number, latitude, location, longitude, mobileNo, name }) => {
        const { error } = await supabase
          .from('accidents')
          .insert({
            severity: 'emergency', // if SOS so default emergency
            reported_by: reported_by,
            reporter_name: name,
            reporter_contact: mobileNo,
            reporter_notes: details,
            latitude: latitude,
            longitude: longitude,
            location_address: location,
            sos_type: true, // sos type TRUE boolean
            emergency_contact_name: emergency_contact_name,
            emergency_contact_number: emergency_contact_number
          })

        if (error) {
          return {
            error: {
              message: error.message
            }
          }
        }

        return {
          data: {
            meta: {
              success: true,
              message: 'Emergency report send.'
            }
          }
        }
      }
    })
  })
})


export const { useSendEmergencyReportMutation } = alertApi