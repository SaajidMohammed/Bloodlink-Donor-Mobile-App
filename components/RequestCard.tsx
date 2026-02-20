import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { Poppins } from '../constants/Typography';
import { BloodRequest } from '../constants/API';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface RequestCardProps {
  request: BloodRequest;
  onDonate: (id: string) => void;
  isResponded: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onDonate, isResponded }) => {
  const hospitalName =
    (request as any).requester_name ||
    request.hospital_name ||
    request.hospital?.hospital_name ||
    "Unknown Hospital";

  const location =
    request.city ||
    request.hospital?.city ||
    'Emergency Unit';

  const handleMap = () => {
    const query = encodeURIComponent(`${hospitalName}, ${location}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      {/* Top Section: Blood Type & Critical Info */}
      <View style={styles.mainRow}>
        <View style={styles.bloodBadgeContainer}>
          <View style={styles.bloodBadge}>
            <MaterialCommunityIcons name="water" size={24} color={Colors.primary} style={styles.dropIcon} />
            <Text style={styles.bloodText}>{request.blood_group}</Text>
          </View>
          <View style={styles.requiredContainer}>
            <Text style={styles.requiredLabel}>URGENT</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.primaryHospitalName} numberOfLines={1}>
              {hospitalName}
            </Text>
          </View>

          <View style={[styles.tag, { backgroundColor: '#E0F2FE', alignSelf: 'flex-start', marginBottom: 8 }]}>
            <Text style={[styles.tagText, { color: '#0284C7' }]}>HOSPITAL REQUEST</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-sharp" size={16} color={Colors.primary} />
              <Text style={styles.metaText}>{location}</Text>
            </View>
          </View>

          <View style={styles.unitsContainer}>
            <View style={styles.unitsBadge}>
              <MaterialCommunityIcons name="blood-bag" size={16} color={Colors.primary} />
              <Text style={styles.unitsText}>{request.units_required} Units Required</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modern Divider */}
      <View style={styles.divider} />

      {/* Footer: Status & Action */}
      <View style={styles.footerRow}>
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>Live Status</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: isResponded ? Colors.success : Colors.warning }]} />
            <Text style={[styles.statusText, { color: isResponded ? Colors.success : Colors.warning }]}>
              {isResponded ? 'Response Logged' : 'Awaiting Donors'}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionBtn, styles.mapBtn]}
            onPress={handleMap}
          >
            <Ionicons name="map" size={18} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.donateBtn,
              isResponded ? styles.disabledBtn : styles.activeBtn
            ]}
            onPress={() => !isResponded && onDonate(request.id)}
            disabled={isResponded}
          >
            {isResponded && <Ionicons name="checkmark-done" size={18} color={Colors.textSecondary} style={{ marginRight: 6 }} />}
            <Text style={[
              styles.donateBtnText,
              isResponded && styles.disabledBtnText
            ]}>
              {isResponded ? "Notified" : "Donate Now"}
            </Text>
            {!isResponded && <Ionicons name="arrow-forward" size={16} color={Colors.white} style={{ marginLeft: 6 }} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(243, 244, 246, 0.8)',
  },
  mainRow: { flexDirection: 'row', alignItems: 'center' },
  bloodBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  bloodBadge: {
    backgroundColor: '#FEF2F2',
    width: 80,
    height: 90,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropIcon: { marginBottom: -4, opacity: 0.9 },
  bloodText: { fontFamily: Poppins.bold, color: Colors.primary, fontSize: 28, lineHeight: 34, marginTop: 4 },
  requiredContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: -10, // overlap badge
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  requiredLabel: { fontFamily: Poppins.bold, color: Colors.white, fontSize: 9, letterSpacing: 0.5 },
  contentContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  primaryHospitalName: { fontFamily: Poppins.bold, fontSize: 18, color: '#111827', flex: 1, letterSpacing: -0.3 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontFamily: Poppins.bold, fontSize: 10, letterSpacing: 0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontFamily: Poppins.medium, fontSize: 14, color: '#6B7280', marginLeft: 6 },
  unitsContainer: { flexDirection: 'row' },
  unitsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  unitsText: { fontFamily: Poppins.semiBold, color: '#374151', fontSize: 13, marginLeft: 6 },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 18,
    marginHorizontal: -6
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusInfo: { flex: 1 },
  statusLabel: { fontFamily: Poppins.medium, fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontFamily: Poppins.bold, fontSize: 14 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    backgroundColor: '#F3F4F6',
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  donateBtn: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  disabledBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', elevation: 0 },
  donateBtnText: { color: Colors.white, fontFamily: Poppins.bold, fontSize: 14 },
  disabledBtnText: { color: '#9CA3AF' },
});