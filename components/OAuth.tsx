import { ActivityIndicator, Alert, Image, Modal, Platform, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constant/icon";
import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState } from "react";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
  offlineAccess: false,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
})

export default function OAuth() {

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS !== 'android') {
        throw new Error('Google Sign-In is currently only available on Android')
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })

      await GoogleSignin.signOut();

      const result = await GoogleSignin.signIn();

      if (!result) {
        throw new Error('No user data received from Google');
      }

      console.log('Google Sign-In result:', JSON.stringify(result, null, 2));

      if (!result.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: result.data.idToken,
      });

      if (error) {
        throw new Error('Failed to sign in with Google');
      }

      console.log('Sign in with ID token response:', JSON.stringify(data, null, 2));

      await supabase.from('profiles').insert({
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email,
        avatarUrl: data.user.user_metadata.picture,
      }); 

    } catch (error) {
      console.error('Error in Google Sign-In:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View>
        <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
          <View className="flex-1 h-[1px] bg-general-100" />
          <Text className="text-lg font-medium">Or</Text>
          <View className="flex-1 h-[1px] bg-general-100" />
        </View>

        <CustomButton
          title="Log In with Google"
          className="mt-5 w-full shadow-none"
          IconLeft={() => (
            <Image
              source={icons.google}
              resizeMode="contain"
              className="w-5 h-5 mx-2"
            />
          )}
          bgVariant="outline"
          textVariant="primary"
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        />
      </View>

      <Modal
        transparent
        visible={isLoading}
        animationType="fade"
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View className="bg-white p-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#0286FF" />
          </View>
        </View>
      </Modal>
    </>
  );
}