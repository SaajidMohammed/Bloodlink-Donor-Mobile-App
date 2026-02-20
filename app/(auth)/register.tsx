import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { router, Link } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

// 1. Import Toast for mobile notifications
import Toast from 'react-native-toast-message';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', blood_group: '', city: '', password: ''
    });

    const [loading, setLoading] = useState(false); // Track API status
    const [showPicker, setShowPicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        // 1. Validation using Toast instead of Alert
        if (!formData.name || !formData.email || !formData.blood_group || !formData.password) {
            return Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please fill in all required fields.'
            });
        }

        setLoading(true);

        // 2. Prepare payload for the backend structure
        const payload = {
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            role: 'DONOR',
            profileData: {
                name: formData.name,
                bloodGroup: formData.blood_group,
                phone: formData.phone,
                city: formData.city
            }
        };

        try {
            // 3. API Request
            await api.post('/auth/register', payload);

            Toast.show({
                type: 'success',
                text1: 'Welcome to BloodLink! 👋',
                text2: 'Account created. You can now login.'
            });

            // Redirect to login after a short delay
            setTimeout(() => {
                router.replace('/login');
            }, 1500);

        } catch (err: any) {
            console.log("Registration Error details:", err.response?.data);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: err.response?.data?.message || "Something went wrong"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Join BloodLink</Text>
                <Text style={styles.subtitle}>Become a lifesaver in your community</Text>

                {/* Full Name */}
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="user" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.flex1}
                        placeholder="John Doe"
                        onChangeText={(v) => setFormData({ ...formData, name: v })}
                    />
                </View>

                {/* Email Address */}
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="mail" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.flex1}
                        placeholder="john@example.com"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={(v) => setFormData({ ...formData, email: v })}
                    />
                </View>

                <View style={styles.row}>
                    {/* Blood Group Dropdown UI */}
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Blood Group</Text>
                        <TouchableOpacity
                            style={styles.dropdownTrigger}
                            onPress={() => setShowPicker(true)}
                        >
                            <Ionicons name="water-outline" size={18} color={Colors.primary} style={styles.inputIcon} />
                            <Text style={[styles.dropdownValue, !formData.blood_group && { color: Colors.textMuted }]}>
                                {formData.blood_group || 'Select'}
                            </Text>
                            <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    {/* Phone Number */}
                    <View style={[styles.flex1, { marginLeft: 15 }]}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="phone" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.flex1}
                                placeholder="10-digit mobile"
                                keyboardType="phone-pad"
                                onChangeText={(v) => setFormData({ ...formData, phone: v })}
                            />
                        </View>
                    </View>
                </View>

                {/* City */}
                <Text style={styles.label}>City</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="map-pin" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.flex1}
                        placeholder="e.g. Chennai"
                        onChangeText={(v) => setFormData({ ...formData, city: v })}
                    />
                </View>

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.flex1}
                        placeholder="........"
                        secureTextEntry={!showPassword}
                        onChangeText={(v) => setFormData({ ...formData, password: v })}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Feather name={showPassword ? "eye" : "eye-off"} size={18} color={Colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Submit Button with Loading State */}
                <TouchableOpacity 
                    style={[styles.button, loading && { opacity: 0.7 }]} 
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/login" asChild>
                        <TouchableOpacity>
                            <Text style={[styles.footerText, { color: Colors.primary, fontFamily: Poppins.bold }]}>Login here</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Blood Group Picker Modal */}
                <Modal visible={showPicker} transparent animationType="fade">
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowPicker(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Blood Group</Text>
                            <FlatList
                                data={BLOOD_GROUPS}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.pickerItem}
                                        onPress={() => {
                                            setFormData({ ...formData, blood_group: item });
                                            setShowPicker(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.pickerItemText,
                                            formData.blood_group === item && { color: Colors.primary, fontFamily: Poppins.bold }
                                        ]}>
                                            {item}
                                        </Text>
                                        {formData.blood_group === item && <Feather name="check" size={18} color={Colors.primary} />}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scrollContainer: { padding: 24, paddingBottom: 60 },
    title: {
        fontSize: 28,
        fontFamily: Poppins.bold,
        color: Colors.secondary,
        textAlign: 'center',
        marginTop: 20
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Poppins.regular,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30
    },
    label: {
        fontFamily: Poppins.medium,
        fontSize: 13,
        color: Colors.secondary,
        marginBottom: 6,
        marginTop: 15
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        backgroundColor: '#F9FAFB'
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        backgroundColor: '#F9FAFB'
    },
    inputIcon: { marginRight: 10 },
    flex1: { flex: 1, fontFamily: Poppins.regular, fontSize: 15, color: Colors.text },
    dropdownValue: { flex: 1, fontFamily: Poppins.regular, fontSize: 15, color: Colors.text },
    row: { flexDirection: 'row', width: '100%' },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    buttonText: { color: Colors.white, fontFamily: Poppins.bold, fontSize: 16 },
    footer: { flexDirection: 'row', marginTop: 25, justifyContent: 'center' },
    footerText: { fontFamily: Poppins.medium, color: Colors.textSecondary, fontSize: 14 },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: Colors.white,
        width: '80%',
        maxHeight: '60%',
        borderRadius: 20,
        padding: 20
    },
    modalTitle: {
        fontFamily: Poppins.bold,
        fontSize: 18,
        color: Colors.secondary,
        marginBottom: 15,
        textAlign: 'center'
    },
    pickerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    pickerItemText: { fontFamily: Poppins.regular, fontSize: 16, color: Colors.text },
});