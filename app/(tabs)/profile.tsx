import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import { MaterialIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { router } from 'expo-router';

// 1. Import Toast for mobile feedback
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
    const { signOut } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [donationCount, setDonationCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetches donor details from PostgreSQL via Render
                const res = await api.get('/donor/profile');
                setUser(res.data);

                // Calculates count from history endpoint
                const historyRes = await api.get('/donor/history');
                if (Array.isArray(historyRes.data)) {
                    setDonationCount(historyRes.data.length);
                }
            } catch (e) {
                console.error("Profile Fetch Error:", e);
                // 2. Add Error Toast for data fetching issues
                Toast.show({
                    type: 'error',
                    text1: 'Sync Error',
                    text2: 'Could not update your profile data.'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            // 3. Success Toast on Logout
            Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'Come back soon to save more lives! 👋'
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: 'Please try again.'
            });
        }
    };

    if (loading || !user) return <ActivityIndicator style={styles.centered} color={Colors.primary} size="large" />;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Modern Header Card */}
                <View style={styles.headerCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
                        <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.contactRow}>
                        <Feather name="mail" size={12} color={Colors.textSecondary} />
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                    {user.phone && (
                        <View style={styles.contactRow}>
                            <Feather name="phone" size={12} color={Colors.textSecondary} />
                            <Text style={styles.userEmail}>{user.phone}</Text>
                        </View>
                    )}
                </View>

                {/* Highlighted Stats Section */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <MaterialIcons name="bloodtype" size={20} color={Colors.primary} />
                        <Text style={styles.statValue}>{user.blood_group}</Text>
                        <Text style={styles.statLabel}>Group</Text>
                    </View>
                    <View style={[styles.statBox, styles.borderLeft]}>
                        <Ionicons name="location-sharp" size={20} color={Colors.primary} />
                        <Text style={styles.statValue}>{user.city}</Text>
                        <Text style={styles.statLabel}>City</Text>
                    </View>
                    <View style={[styles.statBox, styles.borderLeft]}>
                        <FontAwesome5 name="medal" size={18} color={Colors.primary} />
                        <Text style={styles.statValue}>{donationCount}</Text>
                        <Text style={styles.statLabel}>Donations</Text>
                    </View>
                </View>

                {/* Interactive Menu List */}
                <View style={styles.menuContainer}>
                    <Text style={styles.menuHeader}>General</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/history')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#E3F2FD' }]}>
                            <FontAwesome5 name="history" size={16} color="#1976D2" />
                        </View>
                        <Text style={styles.menuText}>Donation History</Text>
                        <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/settings')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="settings-outline" size={18} color="#7B1FA2" />
                        </View>
                        <Text style={styles.menuText}>Account Settings</Text>
                        <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.divider} />
                    <Text style={styles.menuHeader}>Support</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/faq')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#FFF3E0' }]}>
                            <Feather name="help-circle" size={18} color="#EF6C00" />
                        </View>
                        <Text style={styles.menuText}>Help & FAQ</Text>
                        <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 0 }]}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#FFF5F5' }]}>
                            <Ionicons name="log-out-outline" size={20} color={Colors.primary} />
                        </View>
                        <Text style={[styles.menuText, { color: Colors.primary, fontFamily: 'Poppins-Bold' }]}>Logout</Text>
                        <MaterialIcons name="chevron-right" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.versionText}>BloodLink Mobile v1.0.2</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.white },
    container: { flex: 1, backgroundColor: Colors.white }, // Clean white bg
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerCard: {
        backgroundColor: Colors.white,
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 6 }
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FEE2E2', // Light red tint
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: Colors.white,
        position: 'relative'
    },
    onlineBadge: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#10B981', // Success green
        position: 'absolute',
        bottom: 5,
        right: 5,
        borderWidth: 3,
        borderColor: Colors.white
    },
    avatarText: { fontFamily: 'Poppins-Bold', fontSize: 42, color: Colors.primary },
    userName: { fontFamily: 'Poppins-Bold', fontSize: 26, color: Colors.secondary, marginTop: 12 },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
    userEmail: { fontFamily: 'Poppins-Regular', fontSize: 13, color: Colors.textSecondary },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginTop: -30,
        borderRadius: 24,
        padding: 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20
    },
    statBox: { flex: 1, alignItems: 'center', gap: 4 },
    borderLeft: { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' },
    statValue: { fontFamily: 'Poppins-Bold', fontSize: 18, color: Colors.secondary, marginTop: 4 },
    statLabel: { fontFamily: 'Poppins-Regular', fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase' },
    menuContainer: { backgroundColor: Colors.white, margin: 20, borderRadius: 24, padding: 16, elevation: 2 },
    menuHeader: { fontFamily: 'Poppins-Bold', fontSize: 14, color: Colors.textMuted, marginLeft: 10, marginBottom: 10, marginTop: 5 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10 },
    menuIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    menuText: { flex: 1, marginLeft: 16, fontFamily: 'Poppins-Medium', fontSize: 15, color: Colors.secondary },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15, marginHorizontal: 10 },
    versionText: { textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.textMuted, marginBottom: 30 }
});