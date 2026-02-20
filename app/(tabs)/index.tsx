import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { RequestCard } from '../../components/RequestCard';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import api from '../../services/api';
import { BloodRequest } from '../../constants/API';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// 1. Import Toast
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userBloodGroup, setUserBloodGroup] = useState<string | null>(null);

  const fetchRequests = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      let bloodGroup = userBloodGroup;

      if (!bloodGroup) {
        const profileRes = await api.get('/donor/profile'); 
        bloodGroup = profileRes.data.blood_group;
        setUserBloodGroup(bloodGroup);
      }

      const response = await api.get('/donor/emergency-requests'); 
      
      const filteredRequests = response.data.filter((req: BloodRequest) => 
        req.blood_group === bloodGroup && req.status !== 'COMPLETED'
      );
      
      setRequests(filteredRequests);
    } catch (error) {
      console.error("Fetch error:", error);
      // Use Toast for connection issues
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: 'Could not sync with the emergency feed.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userBloodGroup]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests(true);
  };

  const handleDonate = (id: string) => {
    // Keep Alert for confirmation (Security Best Practice)
    Alert.alert(
      "Confirm Interest",
      "By clicking 'Yes', the hospital will receive your contact details to coordinate the donation.",
      [
        { text: "Maybe Later", style: "cancel" },
        { 
          text: "Yes, I'm Ready", 
          onPress: async () => {
            try {
              await api.post('/donor/respond', { requestId: id }); 
              
              // 2. Success Toast
              Toast.show({
                type: 'success',
                text1: 'Interest Logged!',
                text2: 'The hospital has been notified. Thank you! ❤️'
              });

              fetchRequests(true); 
            } catch (error: any) {
              const errorMsg = error.response?.data?.message || "Action failed.";
              
              // 3. Error Toast
              Toast.show({
                type: 'error',
                text1: 'Request Failed',
                text2: errorMsg
              });
            }
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loaderText}>Finding urgent matches...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <RequestCard 
            request={item} 
            onDonate={handleDonate} 
            isResponded={item.status === 'RESPONDED' || item.status === 'DONOR_FOUND'} 
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[Colors.primary]} 
            tintColor={Colors.primary} 
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.greeting}>Emergency Feed</Text>
              <Text style={styles.header}>Active Broadcasts</Text>
            </View>
            <View style={styles.groupBadge}>
              <Text style={styles.groupLabel}>My Group</Text>
              <Text style={styles.groupValue}>{userBloodGroup || '--'}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="shield-check-outline" size={80} color={Colors.border} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>There are currently no urgent requests for {userBloodGroup} in your area.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white }, // Unified background
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  loaderText: { marginTop: 12, fontFamily: Poppins.medium, color: Colors.textSecondary, fontSize: 14 },
  list: { padding: 20, paddingBottom: 100 },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25,
    marginTop: 10 
  },
  greeting: { fontFamily: Poppins.medium, fontSize: 14, color: Colors.primary, letterSpacing: 0.5 },
  header: { fontFamily: Poppins.bold, fontSize: 24, color: Colors.secondary, marginTop: -2 },
  groupBadge: { 
    backgroundColor: Colors.white, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  groupLabel: { fontFamily: Poppins.regular, fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase' },
  groupValue: { fontFamily: Poppins.bold, fontSize: 18, color: Colors.primary },
  emptyContainer: { 
    alignItems: 'center', 
    marginTop: 60, 
    paddingHorizontal: 40 
  },
  emptyTitle: { fontFamily: Poppins.bold, fontSize: 20, color: Colors.secondary, marginTop: 20 },
  emptyText: { 
    fontFamily: Poppins.regular, 
    color: Colors.textSecondary, 
    textAlign: 'center', 
    marginTop: 8,
    lineHeight: 20 
  }
});