import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, SafeAreaView, TextInput } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { TouchableOpacity } from 'react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/donor/history');
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (e) {
      console.error("History fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter logic: Checks hospital name against search query
  const filteredHistory = useMemo(() => {
    return history.filter(item => 
      (item.hospital_name || 'Emergency Donation')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, history]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.historyCard}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="hand-holding-heart" size={18} color={Colors.primary} />
      </View>
      <View style={styles.details}>
        <Text style={styles.hospitalName}>{item.hospital_name || 'Emergency Donation'}</Text>
        <Text style={styles.dateText}>
          {item.completed_at 
            ? new Date(item.completed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
            : 'Completed'}
        </Text>
      </View>
      <View style={styles.unitsBadge}>
        <Text style={styles.unitsText}>{item.units_donated || 1} Unit</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.centered} color={Colors.primary} size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by hospital..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchHistory(); }} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'Donation' : 'Donations'} Found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={60} color={Colors.textMuted} />
            <Text style={styles.emptyText}>
              {searchQuery ? `No results for "${searchQuery}"` : "No donation history found yet."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 20,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontFamily: Poppins.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  listPadding: { padding: 20, paddingTop: 10 },
  resultsCount: {
    fontFamily: Poppins.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 15,
    marginLeft: 5
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  details: { flex: 1, marginLeft: 15 },
  hospitalName: { fontFamily: Poppins.semiBold, fontSize: 15, color: Colors.secondary },
  dateText: { fontFamily: Poppins.regular, fontSize: 12, color: Colors.textSecondary },
  unitsBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  unitsText: { fontFamily: Poppins.bold, fontSize: 11, color: '#2E7D32' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontFamily: Poppins.medium, color: Colors.textMuted, marginTop: 10, textAlign: 'center' }
});