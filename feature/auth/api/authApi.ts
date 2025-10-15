import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { signUpPayload } from "./interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signUp: builder.mutation<any, signUpPayload>({
      queryFn: async ({ email, mobileNo, name, password }) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          phone: mobileNo,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data,
        };
      },
    }),
  }),
});

export const { useSignUpMutation } = authApi;
