import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen({ navigation }) {
  const handleCardPress = (cardTitle) => {
    const scenarioMap = {
      'Flash Floods': 'FlashFloodLessons', 
      'Fire Safety': 'FireSafetyLessons', 
      'First Aid & Medical': 'FirstAidLessons', 
      'Natural Disasters': 'NaturalDisasterLessons' 
    };
  
    const destination = scenarioMap[cardTitle];
    
    if (destination === 'FlashFloodLessons') {
      navigation.navigate('FlashFloodLessons');
    } else {
      // For future courses that don't exist yet
      Alert.alert('Coming Soon', `${cardTitle} lessons will be available soon!`);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header that scrolls with content */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>Emergency Learning</Text>
            <Text style={styles.subtitle}>Interactive Safety Training</Text>
          </View>
        </SafeAreaView>
      </View>
      
      {/* My Badges Section */}
      <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => navigation.navigate('Badges')} // Navigate to Badges Stack
          >
            <Text style={styles.sectionTitle}>My Badges</Text>
            <Ionicons name="chevron-forward" size={20} color="#718096" />
          </TouchableOpacity>
          <View style={styles.badgesContainer}>
            <Text style={styles.badgesPlaceholder}>Tap to view all badges</Text>
            <Text style={styles.badgesSubtext}>Complete learning modules to earn badges</Text>
          </View>
        </View>

      {/* Emergency Training Courses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Training Courses</Text>
        
        {/* Flash Floods - Available */}
        <View style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🌊</Text>
            </View>
            <View style={styles.courseTitleSection}>
              <Text style={styles.courseTitle}>Flash Floods</Text>
              <Text style={styles.courseLevel}>🎮 Available</Text>
            </View>
          </View>
          
          <Text style={styles.courseDescription}>
            Master flash flood preparedness and response protocols.
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercent}>0%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '0%' }]} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => handleCardPress('Flash Floods')}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Course</Text>
          </TouchableOpacity>
        </View>

        {/* Fire Safety - Planned */}
        <View style={[styles.courseCard, styles.plannedCard]}>
          <View style={styles.courseHeader}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🔥</Text>
            </View>
            <View style={styles.courseTitleSection}>
              <Text style={styles.courseTitle}>Fire Safety</Text>
              <Text style={styles.courseLevel}>🚧 Planned</Text>
            </View>
          </View>
          
          <Text style={styles.courseDescription}>
            Fire prevention and emergency response protocols.
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercent}>0%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '0%' }]} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.startButton, styles.plannedButton]}
            disabled={true}
          >
            <Text style={styles.plannedButtonText}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        {/* First Aid & Medical - Planned */}
        <View style={[styles.courseCard, styles.plannedCard]}>
          <View style={styles.courseHeader}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🚑</Text>
            </View>
            <View style={styles.courseTitleSection}>
              <Text style={styles.courseTitle}>First Aid & Medical</Text>
              <Text style={styles.courseLevel}>🚧 Planned</Text>
            </View>
          </View>
          
          <Text style={styles.courseDescription}>
            CPR, AED usage, and emergency medical procedures.
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercent}>0%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '0%' }]} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.startButton, styles.plannedButton]}
            disabled={true}
          >
            <Text style={styles.plannedButtonText}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        {/* Natural Disasters - Planned */}
        <View style={[styles.courseCard, styles.plannedCard]}>
          <View style={styles.courseHeader}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🌪️</Text>
            </View>
            <View style={styles.courseTitleSection}>
              <Text style={styles.courseTitle}>Natural Disasters</Text>
              <Text style={styles.courseLevel}>🚧 Planned</Text>
            </View>
          </View>
          
          <Text style={styles.courseDescription}>
            Earthquakes, tsunamis, and natural disaster protocols.
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercent}>0%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '0%' }]} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.startButton, styles.plannedButton]}
            disabled={true}
          >
            <Text style={styles.plannedButtonText}>Coming Soon</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header styling that scrolls
  headerBackground: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  
  safeArea: {
    // SafeAreaView handles the notch padding
  },
  
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },

  // Badges section
  badgesContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    minHeight: 120,
  },

  badgesPlaceholder: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },

  badgesSubtext: {
    fontSize: 14,
    color: colors.text.light,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Course cards
  courseCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  
  plannedCard: {
    opacity: 0.85,
    borderLeftColor: colors.secondary,
  },
  
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Image placeholder
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  
  placeholderText: {
    fontSize: 24,
  },
  
  courseTitleSection: {
    flex: 1,
  },
  
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  courseLevel: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  
  courseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  
  // Progress section
  progressSection: {
    marginBottom: 16,
  },
  
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  progressPercent: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50', 
    borderRadius: 4,
  },
  
  // Start button
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  plannedButton: {
    backgroundColor: '#e9ecef',
  },
  
  plannedButtonText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  
  bottomPadding: {
    height: 100,
  },
});