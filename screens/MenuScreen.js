import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export default function MenuScreen({ navigation }) {
  const handleCardPress = (cardTitle) => {
    // Map card titles to scenario types
    const scenarioMap = {
      'Before Flash Flood': 'before',
      'During Flash Flood': 'during',
      'After Flash Flood': 'after'
    };

    const scenarioType = scenarioMap[cardTitle];
    
    if (scenarioType) {
      // Navigate to FlashFloodSimulator with scenario parameter
      navigation.navigate('FlashFloodSimulator', { scenario: scenarioType });
    } else {
      console.log(`Pressed: ${cardTitle}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Emergency Learning</Text>
      <Text style={styles.pageSubtitle}>Interactive Flash Flood Training</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1: Before Flash Flood */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleCardPress('Before Flash Flood')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>01</Text>
            <Text style={styles.cardTitle}>Before Flash Flood</Text>
            <Text style={styles.cardLevel}>🎮 Interactive</Text>
          </View>
          <Text style={styles.cardDescription}>
            🎯 Help James prepare for potential flash floods! Learn about emergency kits, 
            evacuation routes, and early warning signs through interactive scenarios.
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>⭐ 3 Scenarios</Text>
              <Text style={styles.cardStat}>⏱️ 5 min</Text>
            </View>
            <Text style={styles.cardAction}>Start Mission →</Text>
          </View>
        </TouchableOpacity>

        {/* Card 2: During Flash Flood */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleCardPress('During Flash Flood')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>02</Text>
            <Text style={styles.cardTitle}>During Flash Flood</Text>
            <Text style={styles.cardLevel}>🎮 Interactive</Text>
          </View>
          <Text style={styles.cardDescription}>
            🚨 James is caught in a flash flood emergency! Make critical decisions about 
            evacuation, safety, and emergency communication in this high-stakes simulation.
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>⭐ 3 Scenarios</Text>
              <Text style={styles.cardStat}>⏱️ 5 min</Text>
            </View>
            <Text style={styles.cardAction}>Start Mission →</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3: After Flash Flood */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleCardPress('After Flash Flood')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>03</Text>
            <Text style={styles.cardTitle}>After Flash Flood</Text>
            <Text style={styles.cardLevel}>🎮 Interactive</Text>
          </View>
          <Text style={styles.cardDescription}>
            🏠 The flood has passed. Guide James through safe recovery: water safety, 
            property assessment, health precautions, and community recovery steps.
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>⭐ 3 Scenarios</Text>
              <Text style={styles.cardStat}>⏱️ 5 min</Text>
            </View>
            <Text style={styles.cardAction}>Start Mission →</Text>
          </View>
        </TouchableOpacity>

        {/* Coming Soon Cards */}
        <View style={[styles.card, styles.comingSoonCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>04</Text>
            <Text style={styles.cardTitle}>Earthquake Preparedness</Text>
            <Text style={styles.cardLevel}>🚧 Coming Soon</Text>
          </View>
          <Text style={styles.cardDescription}>
            Learn earthquake safety through interactive scenarios with James.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>

        <View style={[styles.card, styles.comingSoonCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>05</Text>
            <Text style={styles.cardTitle}>Fire Safety</Text>
            <Text style={styles.cardLevel}>🚧 Coming Soon</Text>
          </View>
          <Text style={styles.cardDescription}>
            Master fire safety and evacuation procedures through gamified learning.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: fontSize.header,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: fontSize.lg,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  comingSoonCard: {
    opacity: 0.6,
    borderLeftColor: '#9ca3af',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor: '#fff5f5',
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 20,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  cardLevel: {
    fontSize: fontSize.sm,
    color: colors.primary,
    backgroundColor: '#fff5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 12,
  },
  cardStat: {
    fontSize: fontSize.sm,
    color: colors.text.light,
    fontWeight: '600',
  },
  cardAction: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  comingSoonText: {
    fontSize: fontSize.md,
    color: '#9ca3af',
    fontWeight: '600',
  },
});