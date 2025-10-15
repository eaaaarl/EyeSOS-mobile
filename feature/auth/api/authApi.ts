import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { signUpPayload } from "./interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signUp: builder.mutation<any, signUpPayload>({
      queryFn: async ({ email, mobileNo, name, password }) => {
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: email.trim().toLowerCase(),
            password: password,
          }
        );

        if (authError) {
          return {
            error: {
              message: authError.message,
            },
          };
        }

        if (authData.user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: authData.user.id,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobileNo: mobileNo,
              },
            ])
            .select();

          if (profileError) {
            return {
              error: {
                message: profileError.message,
              },
            };
          }

          return {
            data: {
              user: authData.user,
              profile: profileData?.[0],
            },
          };
        }

        return {
          error: {
            message: "User creation failed",
          },
        };
      },
    }),
  }),
});

export const { useSignUpMutation } = authApi;
