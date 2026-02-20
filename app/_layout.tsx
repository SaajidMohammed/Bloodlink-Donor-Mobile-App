import { JSX, useEffect } from 'react';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';

// 1. Import Toast components
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

// 2. Define Custom Styling to match your Web App branding
const toastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.primary, borderLeftWidth: 5, height: 70, backgroundColor: '#fff' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ 
        fontSize: 16, 
        fontFamily: 'Poppins-Bold', 
        color: '#1e293b' 
      }}
      text2Style={{ 
        fontSize: 13, 
        fontFamily: 'Poppins-Regular', 
        color: '#64748b' 
      }}
    />
  ),
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#ef4444', borderLeftWidth: 5, height: 70 }}
      text1Style={{ 
        fontSize: 16, 
        fontFamily: 'Poppins-Bold' 
      }}
      text2Style={{ 
        fontSize: 13, 
        fontFamily: 'Poppins-Regular' 
      }}
    />
  )
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen once fonts and auth token are ready
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Route grouping handles the flow between Auth and Main Tabs */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>

      {/* 3. Global Toast Component - Placed at the very bottom */}
      <Toast config={toastConfig} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded) return null;

  return (
    // Wrap the entire app in the AuthProvider to manage JWT sessions
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}