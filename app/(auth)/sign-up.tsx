import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputFields";
import OAuth from "@/components/OAuth";
import { icons } from "@/constant/icon";
import { image } from "@/constant/image";

import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignUp = () => {
  const insets = useSafeAreaInsets()
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  });

  const onSignUpPress = useCallback(async () => {
    console.log(form)
  }, [form]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={image.logo} className="z-0 w-full h-[250px]" />
        </View>
        <View className="p-5">
          <Text className="text-2xl text-black font-semibold">
            Create Your Account
          </Text>
          <InputField
            label="Name"
            placeholder="Enter full name"
            icon={icons.person}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Mobile No."
            placeholder="Enter mobile no."
            icon={icons.phone}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title={`Sign Up`}
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <View className="flex-row justify-center items-center mt-10" style={{ marginBottom: insets.bottom }}>
            <Text className="text-lg text-general-200">Already have an account? </Text>
            <Link
              href={`/(auth)/sign-in`}
              className=""
            >
              <Text className="text-lg text-primary-500 underline font-medium">Sign In</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;