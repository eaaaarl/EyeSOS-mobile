import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputFields";
import OAuth from "@/components/OAuth";
import { icons } from "@/constant/icon";
import { image } from "@/constant/image";
import { useSignInMutation } from "@/feature/auth/api/authApi";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const SignIn = () => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [signIn, { isLoading }] = useSignInMutation();

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form.email, form.password]);

  const onSignInPress = useCallback(async () => {
    setErrors({
      email: "",
      password: "",
    });

    if (!validateForm()) {
      return;
    }

    try {
      const res = await signIn({
        email: form.email,
        password: form.password
      });

      console.log('signin response:', res);

      if ('error' in res) {
        Alert.alert(
          "Sign In Failed",
          "Invalid email or password",
          [{ text: "OK" }]
        );
      } else if ('data' in res) {
        router.replace("/(root)/home");
      }
    } catch (error) {
      console.error('signin error:', error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again.",
        [{ text: "OK" }]
      );
    }
  }, [form, signIn, validateForm]);

  return (
    <>
      <KeyboardAwareScrollView className="flex-1">
        <View className=" bg-white" style={{ flex: 1 }}>
          <View className="relative w-full h-[250px]">
            <Image source={image.logo} className="z-0 w-full h-[250px]" />
          </View>
          <View className="p-5">
            <Text className="text-2xl text-black font-semibold mb-6">
              Sign in
            </Text>

            <InputField
              label="Email"
              placeholder="Enter email"
              icon={icons.email}
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => {
                setForm({ ...form, email: value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email ? (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.email}
              </Text>
            ) : null}

            <InputField
              label="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => {
                setForm({ ...form, password: value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password ? (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.password}
              </Text>
            ) : null}

            <CustomButton
              title="Sign In"
              onPress={onSignInPress}
              className="mt-6"
              disabled={isLoading}
            />

            <OAuth />

            <View
              className="flex-row justify-center items-center mt-10"
              style={{ marginBottom: insets.bottom }}
            >
              <Text className="text-lg text-general-200">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-up">
                <Text className="text-lg text-primary-500 underline font-medium">
                  Sign Up
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

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
            <Text className="mt-4 text-base text-gray-700 font-medium">
              Signing in...
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SignIn;