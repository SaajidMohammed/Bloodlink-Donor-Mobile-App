import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { router, Tabs } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                // Active tab uses BloodLink Red
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 5,
                    elevation: 10, // Shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Poppins-Medium',
                    fontSize: 11,
                },
                headerTitleStyle: {
                    fontFamily: 'Poppins-Bold',
                    fontSize: 18,
                    color: Colors.secondary,
                },
                headerStyle: {
                    backgroundColor: Colors.white,
                },
                headerShadowVisible: false,
                headerTitleAlign: 'center',
            }}
        >
            {/* 1. Emergency Feed (Home) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Emergency',
                    tabBarLabel: 'Home',
                    headerTitle: 'BloodLink Requests',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="bloodtype" size={28} color={color} />
                    ),
                }}
            />
            {/* 3. Hospital Discovery */}
            <Tabs.Screen
                name="hospitals"
                options={{
                    title: 'List',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="local-hospital" size={28} color={color} />
                    ),
                }}
            />

            {/* 4. Personalized Feed / Notifications */}
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'My Feed',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="notifications" size={24} color={color} />
                    ),
                }}
            />

            {/* 4. My Profile */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person" size={24} color={color} />
                    ),
                }}
            />

            {/* --- HIDDEN ROUTES (Accessible via router.push) --- */}

            <Tabs.Screen
                name="history"
                options={{
                    href: null,
                    headerShown: true,
                    headerTitle: "Donation History",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 20 }}>
                            <Ionicons name="chevron-back" size={28} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    href: null,
                    headerShown: true,
                    headerTitle: "Account Settings",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 20 }}>
                            <Ionicons name="chevron-back" size={28} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tabs.Screen
                name="faq"
                options={{
                    href: null,
                    headerShown: true,
                    headerTitle: "Help & FAQ",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 20 }}>
                            <Ionicons name="chevron-back" size={28} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            {/* Appointment Booking Route */}
            <Tabs.Screen
                name="book-appointment"
                options={{
                    href: null,
                    headerShown: true,
                    headerTitle: "Book Appointment",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 20 }}>
                            <Ionicons name="chevron-back" size={28} color={Colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tabs>
    );
}