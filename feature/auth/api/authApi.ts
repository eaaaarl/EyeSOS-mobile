import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getProfilesRespons, signInPayload, signUpPayload } from "./interface";

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

    signIn: builder.mutation<any, signInPayload>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            user: data.user,
          },
        };
      },
    }),

    getProfiles: builder.query<getProfilesRespons, { id: string }>({
      queryFn: async ({ id }) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
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
            profile: data,
          },
        };
      },
    }),

    signOut: builder.mutation<any, void>({
      queryFn: async () => {
        await supabase.auth.signOut();
        return {
          data: {
            status: true,
          },
        };
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetProfilesQuery,
  useSignOutMutation,
} = authApi;
