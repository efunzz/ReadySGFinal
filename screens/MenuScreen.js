import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export default function MenuScreen({ navigation }) {
  const handleCardPress = (cardTitle) => {
    // Map card titles to scenario types - keeping same navigation to FlashFloodSimulator
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
      <Text style={styles.pageSubtitle}>Interactive Safety Training with James</Text>
      
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
            🎯 Help James prepare for potential flash floods following SCDF protocols! Learn about Ready Bag preparation, 
            emergency supplies, and early warning response through interactive scenarios.
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
            🚨 James faces a flash flood emergency! Make critical decisions about evacuation, 
            vehicle safety, emergency calls (995), and rescue procedures based on SCDF guidelines.
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
            🏠 The flood has passed. Guide James through safe recovery: electrical safety, 
            structural damage assessment, and contamination protocols per SCDF procedures.
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>⭐ 3 Scenarios</Text>
              <Text style={styles.cardStat}>⏱️ 5 min</Text>
            </View>
            <Text style={styles.cardAction}>Start Mission →</Text>
          </View>
        </TouchableOpacity>

        {/* Card 4: Fire Safety & Evacuation - SCDF Coverage */}
        <TouchableOpacity 
          style={[styles.card, styles.plannedCard]}
          onPress={() => handleCardPress('Fire Safety & Evacuation')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>04</Text>
            <Text style={styles.cardTitle}>Fire Safety & Evacuation</Text>
            <Text style={styles.cardLevel}>🚧 Planned</Text>
          </View>
          <Text style={styles.cardDescription}>
            🔥 Learn fire prevention, extinguisher use (P.A.S.S. method), smoke evacuation, 
            gas leak response, and EV fire safety with interactive scenarios.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.plannedText}>SCDF Handbook Coverage Available</Text>
          </View>
        </TouchableOpacity>

        {/* Card 5: First Aid & Medical Emergencies - SCDF Coverage */}
        <TouchableOpacity 
          style={[styles.card, styles.plannedCard]}
          onPress={() => handleCardPress('First Aid & Medical')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>05</Text>
            <Text style={styles.cardTitle}>First Aid & Medical</Text>
            <Text style={styles.cardLevel}>🚧 Planned</Text>
          </View>
          <Text style={styles.cardDescription}>
            🚑 Practice CPR, AED usage, treating bleeding, fractures, burns, choking, 
            and stroke response through hands-on simulations.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.plannedText}>SCDF Handbook Coverage Available</Text>
          </View>
        </TouchableOpacity>

        {/* Card 6: Natural Disasters - SCDF Coverage */}
        <TouchableOpacity 
          style={[styles.card, styles.plannedCard]}
          onPress={() => handleCardPress('Natural Disasters')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>06</Text>
            <Text style={styles.cardTitle}>Natural Disasters</Text>
            <Text style={styles.cardLevel}>🚧 Planned</Text>
          </View>
          <Text style={styles.cardDescription}>
            🌪️ Navigate earthquakes, tremors, landslides, tsunamis, typhoons, lightning, 
            and power outages using official SCDF emergency protocols.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.plannedText}>SCDF Handbook Coverage Available</Text>
          </View>
        </TouchableOpacity>

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
  plannedCard: {
    opacity: 0.85,
    borderLeftColor: colors.secondary, // Green for planned content
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
    backgroundColor: colors.primaryLight,
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
    backgroundColor: colors.primaryLight,
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
  plannedText: {
    fontSize: fontSize.sm,
    color: colors.secondary,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});