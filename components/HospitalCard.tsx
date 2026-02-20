import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Platform, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Poppins } from '../constants/Typography';
import { Hospital } from '../constants/API';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

export const HospitalCard: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  
  const handleCall = async () => {
    // 1. Check all common backend keys for the phone number
    const rawNumber = 
      hospital.contact_number || 
      (hospital as any).phone || 
      (hospital as any).contact || 
      (hospital as any).phone_number;

    // 2. Debugging: If it still fails, this will show you exactly what the object looks like
    if (!rawNumber) {
      console.log("DEBUG - Received Hospital Object:", JSON.stringify(hospital, null, 2));
      return Alert.alert("Not Available", "This hospital hasn't provided a contact number yet.");
    }

    // 3. Clean the number: Remove spaces/dashes so the mobile dialer accepts it
    const cleanNumber = String(rawNumber).replace(/[^0-9+]/g, '');
    const url = `tel:${cleanNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        // This opens the native mobile caller directly
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Phone calls are not supported on this device/emulator.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not open the phone dialer.");
    }
  };

  const handleMap = () => {
    const query = encodeURIComponent(`${hospital.hospital_name}, ${hospital.city || ''}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        <View style={styles.iconBox}>
          <MaterialIcons name="local-hospital" size={26} color={Colors.primary} />
        </View>

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{hospital.hospital_name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={Colors.primary} />
            <Text style={styles.cityText}>{hospital.city || 'Verified Center'}</Text>
          </View>
          <Text style={styles.address} numberOfLines={2}>{hospital.address}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.mapButton]} 
          onPress={handleMap}
          activeOpacity={0.7}
        >
          <Feather name="map-pin" size={16} color={Colors.secondary} />
          <Text style={styles.mapButtonText}>Directions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.callButton]} 
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Feather name="phone-call" size={16} color={Colors.white} />
          <Text style={styles.callButtonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 18,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  contentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  iconBox: { 
    width: 52, 
    height: 52, 
    borderRadius: 14, 
    backgroundColor: '#FFF5F5', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE3E3'
  },
  details: { flex: 1, marginLeft: 16 },
  name: { fontFamily: Poppins.bold, fontSize: 17, color: Colors.secondary, letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 4 },
  cityText: { fontFamily: Poppins.bold, fontSize: 12, color: Colors.primary, marginLeft: 4, textTransform: 'uppercase' },
  address: { fontFamily: Poppins.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { 
    flex: 1, 
    flexDirection: 'row', 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  mapButton: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  mapButtonText: { color: Colors.secondary, fontFamily: Poppins.semiBold, marginLeft: 8, fontSize: 14 },
  callButton: { backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  callButtonText: { color: Colors.white, fontFamily: Poppins.bold, marginLeft: 8, fontSize: 14 }
});