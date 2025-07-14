import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';



export default function MenuScreen({ navigation }) {
  const handleCardPress = (cardTitle) => {
    // Placeholder for future navigation or modal opening
    console.log(`Pressed: ${cardTitle}`);
    // navigation.navigate('CardDetail', { title: cardTitle });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Emergency Learning</Text>
      <Text style={styles.pageSubtitle}>Flash Flood Preparedness</Text>
      
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
          </View>
          <Text style={styles.cardDescription}>
            Help James prepare for potential flash floods. Learn about emergency kits, 
            evacuation routes, and early warning signs to stay safe before disaster strikes.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Tap to learn →</Text>
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
          </View>
          <Text style={styles.cardDescription}>
            James is caught in a flash flood! Learn the critical do's and don'ts: 
            when to evacuate, how to stay safe in water, and emergency communication tactics.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Tap to learn →</Text>
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
          </View>
          <Text style={styles.cardDescription}>
            The flood has passed. Help James recover safely by learning about water safety, 
            property assessment, health precautions, and community recovery steps.
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>Tap to learn →</Text>
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
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  cardDescription: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  cardAction: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
});