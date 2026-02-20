import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';
import { router } from 'expo-router';

// 1. Import Toast for mobile feedback
import Toast from 'react-native-toast-message';

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/donor/profile'); 
        setFormData({
          name: res.data.name,
          phone: res.data.phone || '',
          city: res.data.city || '',
        });
      } catch (e) {
        console.error(e);
        // 2. Error Toast if profile fails to load
        Toast.show({
          type: 'error',
          text1: 'Load Failed',
          text2: 'Could not retrieve your account data.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      return Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name cannot be empty.'
      });
    }

    setUpdating(true);
    try {
      await api.put('/donor/profile', formData);
      
      // 3. Success Toast
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your changes have been saved! ✨'
      });

      // Navigate back after a short delay so they see the toast
      setTimeout(() => {
        router.back();
      }, 1000);
      
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err.response?.data?.message || "Failed to save changes"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.centered} color={Colors.primary} size="large" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Account Settings</Text>
        <Text style={styles.subtitle}>Update your contact info so hospitals can reach you</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={18} color={Colors.textMuted} style={styles.icon} />
            <TextInput 
              style={styles.input} 
              value={formData.name} 
              placeholder="Full Name"
              onChangeText={(v) => setFormData({...formData, name: v})}
            />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Feather name="phone" size={18} color={Colors.textMuted} style={styles.icon} />
            <TextInput 
              style={styles.input} 
              value={formData.phone} 
              keyboardType="phone-pad"
              placeholder="Enter mobile number"
              onChangeText={(v) => setFormData({...formData, phone: v})}
            />
          </View>

          <Text style={styles.label}>City</Text>
          <View style={styles.inputWrapper}>
            <Feather name="map-pin" size={18} color={Colors.textMuted} style={styles.icon} />
            <TextInput 
              style={styles.input} 
              value={formData.city} 
              placeholder="Your current city"
              onChangeText={(v) => setFormData({...formData, city: v})}
            />
          </View>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#0284c7" />
            <Text style={styles.infoText}>
              Your blood group is verified and locked. Contact support to request a change for medical reasons.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, updating && { opacity: 0.7 }]} 
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  container: { padding: 24, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: 'Poppins-Bold', fontSize: 24, color: Colors.secondary },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: 30 },
  form: { marginTop: 10 },
  label: { fontFamily: 'Poppins-Medium', fontSize: 14, color: Colors.secondary, marginBottom: 8, marginTop: 15 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: Colors.border,
    paddingHorizontal: 15,
    height: 55
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 16, color: Colors.secondary },
  infoBox: { 
    flexDirection: 'row', 
    backgroundColor: '#f0f9ff', 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe'
  },
  infoText: { flex: 1, marginLeft: 10, fontFamily: 'Poppins-Regular', fontSize: 12, color: '#0369a1' },
  saveButton: { 
    backgroundColor: Colors.primary, 
    borderRadius: 12, 
    height: 55, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 40,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  saveButtonText: { color: Colors.white, fontFamily: 'Poppins-Bold', fontSize: 17 }
});