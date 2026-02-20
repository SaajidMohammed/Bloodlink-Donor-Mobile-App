import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import { HospitalCard } from '../../components/HospitalCard';
import { Hospital } from '../../constants/API';
import api from '../../services/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// 1. Import Toast
import Toast from 'react-native-toast-message';

export default function HospitalsScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHospitals = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await api.get('/donor/hospitals');
      setHospitals(response.data);
      setFilteredHospitals(response.data);
    } catch (error) {
      console.error("Hospital Fetch Error:", error);
      
      // 2. Add Error Toast
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: 'Could not load hospital directory. Please try again.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  // Handle Search Filtering
  useEffect(() => {
    const filtered = hospitals.filter(h => 
      h.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHospitals(filtered);
  }, [searchQuery, hospitals]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHospitals(true);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loaderText}>Loading partner network...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            placeholder="Search by name or city..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textMuted}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredHospitals}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => <HospitalCard hospital={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={Colors.primary}
            colors={[Colors.primary]} 
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Partner Hospitals</Text>
            <Text style={styles.subHeader}>
              {filteredHospitals.length === 0 
                ? 'Looking for centers...' 
                : `${filteredHospitals.length} centers available`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyText}>No hospitals found matching your search.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  loaderText: { marginTop: 10, fontFamily: 'Poppins-Medium', color: Colors.textSecondary },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: Colors.white,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.secondary,
  },
  headerContainer: { paddingHorizontal: 20, marginVertical: 20 },
  header: { fontFamily: 'Poppins-Bold', fontSize: 24, color: Colors.secondary },
  subHeader: { fontFamily: 'Poppins-Medium', fontSize: 13, color: Colors.primary, marginTop: -2 },
  list: { paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontFamily: 'Poppins-Medium', color: Colors.textMuted, marginTop: 10 }
});