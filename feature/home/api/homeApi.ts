import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { ReportsResponse } from "../interface/get-reports.interface";
import { SendReportPayload } from "../interface/send-report.interface";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["getReports"],
  endpoints: (builder) => ({
    sendReport: builder.mutation<any, SendReportPayload>({
      queryFn: async (payload) => {
        console.log("payload", payload);

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

        // Get accidents report number
        /* const { data: reportNumberData, error: reportNumberError } =
          await supabase
            .from("accidents")
            .select("report_number")
            .eq("reported_by", payload.reported_by);

        if (reportNumberError) {
          return {
            error: {
              message: reportNumberError.message,
            },
          };
        }

        console.log("Report number:", reportNumberData); */

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
      invalidatesTags: ["getReports"],
    }),

    getReports: builder.query<
      ReportsResponse,
      { userId: string; page?: number; limit?: number }
    >({
      queryFn: async ({ userId, page = 1, limit = 5 }) => {
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
          .from("accidents")
          .select("*", { count: "exact" })
          .eq("reported_by", userId)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          return {
            error: {
              error: error.message,
            },
          };
        }

        const totalCount = count ?? 0;
        const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 1;
        const hasNext = page * limit < totalCount;
        const hasPrevious = page > 1;

        return {
          data: {
            reports: data,
            meta: {
              success: true,
              message: "Reports Fetched",
              pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNext,
                hasPrevious,
              },
            },
          },
        };
      },
      providesTags: ["getReports"],
    }),
  }),
});

export const { useSendReportMutation, useGetReportsQuery } = homeApi;
