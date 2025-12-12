import AuthProvider from "@/components/AuthProvider";
import store, { persistor } from "@/lib/redux/store";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <KeyboardProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </KeyboardProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
