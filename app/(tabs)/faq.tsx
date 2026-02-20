import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Poppins } from '../../constants/Typography';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const FAQ_DATA = [
  {
    question: "Who can donate blood?",
    answer: "Generally, donors must be between 18-65 years old, weigh at least 50kg, and be in good health. Specific eligibility depends on medical history."
  },
  {
    question: "How often can I donate?",
    answer: "You can typically donate whole blood every 3 months (90 days). This allows your body to replenish its iron levels."
  },
  {
    question: "What should I do before donating?",
    answer: "Eat a healthy meal, stay hydrated, and get a good night's sleep. Avoid fatty foods and alcohol 24 hours before your appointment."
  },
  {
    question: "How long does the process take?",
    answer: "The actual donation takes about 10 minutes, but the entire process (registration, screening, and recovery) takes about 45-60 minutes."
  }
];

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>How can we help you?</Text>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={Colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* FAQ List */}
        <View style={styles.faqList}>
          {filteredFaqs.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.faqItem}
              onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
              activeOpacity={0.7}
            >
              <View style={styles.questionRow}>
                <Text style={styles.questionText}>{item.question}</Text>
                <MaterialIcons 
                  name={expandedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={24} 
                  color={Colors.primary} 
                />
              </View>
              {expandedIndex === index && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support Section */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportSub}>Our team is available to assist you with any technical or medical queries.</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.white} />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  container: { padding: 20 },
  sectionTitle: { fontFamily: Poppins.bold, fontSize: 24, color: Colors.secondary, marginBottom: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25
  },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: Poppins.regular, fontSize: 14, color: Colors.secondary },
  faqList: { marginBottom: 30 },
  faqItem: { 
    backgroundColor: Colors.white, 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F3F5'
  },
  questionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questionText: { flex: 1, fontFamily: Poppins.semiBold, fontSize: 15, color: Colors.secondary, paddingRight: 10 },
  answerText: { fontFamily: Poppins.regular, fontSize: 14, color: Colors.textSecondary, marginTop: 12, lineHeight: 20 },
  supportCard: { 
    backgroundColor: '#FFF5F5', 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center',
    marginBottom: 40
  },
  supportTitle: { fontFamily: Poppins.bold, fontSize: 18, color: Colors.secondary, marginBottom: 8 },
  supportSub: { fontFamily: Poppins.regular, fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  contactButton: { 
    backgroundColor: Colors.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    borderRadius: 12,
    gap: 10
  },
  contactButtonText: { color: Colors.white, fontFamily: Poppins.bold, fontSize: 15 }
});