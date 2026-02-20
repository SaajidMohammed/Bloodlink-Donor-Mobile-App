import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontFamily: Poppins.semiBold,
          fontSize: 18,
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerShadowVisible: false, // Clean, flat design
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Join BloodLink' }} />
    </Stack>
  );
}