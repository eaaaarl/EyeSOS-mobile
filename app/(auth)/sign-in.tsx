import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputFields";
import OAuth from "@/components/OAuth";
import { icons } from "@/constant/icon";

import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
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
          {/* <Image source={images.baobaoAuth} className="z-0 w-full h-[250px]" /> */}
          {/*  <Text className="text-2xl text-black font-semibold absolute bottom-5 left-5">
            Welcome
          </Text> */}
        </View>
        <View className="p-5">
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
            title={`Sign In`}
            onPress={onSignInPress}
            className="mt-6"
          />
          <OAuth />
          <View className="flex-row justify-center items-center mt-10">
            <Text className="text-lg text-general-200">Don&apos;t have an account? </Text>
            <Link
              href={`/(auth)/sign-in`}
              className=""
            >
              <Text className="text-lg text-primary-500 underline font-medium">Sign Up</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;