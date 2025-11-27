import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { ReportsResponse } from "../interface/get-reports.interface";
import { SendReportPayload } from "../interface/send-report.interface";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    sendReport: builder.mutation<any, SendReportPayload>({
      queryFn: async (payload) => {
        const fileExtension = "jpg";
        const fileName = `${payload.reporter_name}-${Date.now()}.${fileExtension}`;
        const filePath = `incidents/${fileName}`;

        const base64 = await FileSystem.readAsStringAsync(
          payload.imageUrl ?? "",
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        const arrayBuffer = decode(base64);

        const { error: storageError } = await supabase.storage
          .from("accidents_images")
          .upload(filePath, arrayBuffer, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (storageError) throw storageError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("accidents_images").getPublicUrl(filePath);

        const { data, error } = await supabase
          .from("accidents")
          .insert({
            ...payload,
            imageUrl: [publicUrl],
          })
          .single();

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            data,
            meta: {
              message: "Report send.",
              success: true,
            },
          },
        };
      },
    }),

    getReports: builder.query<ReportsResponse, { userId: string }>({
      queryFn: async ({ userId }) => {
        const { data, error } = await supabase
          .from("accidents")
          .select("*")
          .eq("reported_by", userId);

        if (error) {
          return {
            error: {
              error: error.message,
            },
          };
        }

        return {
          data: {
            reports: data,
            meta: {
              success: true,
              message: "Reports Fetched",
            },
          },
        };
      },
    }),
  }),
});

export const { useSendReportMutation, useGetReportsQuery } = homeApi;
