import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { BadgeService } from '../services/badgeService'; 
import { supabase } from '../lib/supabase'; 

export default function MenuScreen({ navigation }) {
  const [courseProgress, setCourseProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentBadges, setRecentBadges] = useState([]);
  
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
      Alert.alert('Coming Soon', `${cardTitle} lessons will be available soon!`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCourseProgress();
    }, [])
  );

  const loadCourseProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('🔄 Refreshing course progress for user:', user.id);
        
        // Get badges data
        const badges = await BadgeService.getUserBadges(user.id);
        console.log('📊 All badges loaded:', badges);
        
        // Find flood expert badge for progress
        const floodExpertBadge = badges.find(b => b.id === 'flood_expert');
        console.log('📊 Flood Expert Badge:', floodExpertBadge);
        
        if (floodExpertBadge) {
          const newProgress = Math.round((floodExpertBadge.progress / floodExpertBadge.maxProgress) * 100);
          console.log(`✅ Setting progress: ${floodExpertBadge.progress}/${floodExpertBadge.maxProgress} = ${newProgress}%`);
          setCourseProgress(newProgress);
        } else {
          console.log('❌ No flood expert badge found');
          setCourseProgress(0);
        }

        // Get recent completed or in-progress badges (limit to 3 for preview)
        const completedBadges = badges.filter(badge => 
          badge.status === 'completed' || badge.status === 'in_progress'
        );
        console.log('🎯 Completed/In-progress badges:', completedBadges);
        
        setRecentBadges(completedBadges.slice(0, 3));
      }
    } catch (error) {
      console.error('❌ Error loading course progress:', error);
    } finally {
      setLoading(false);
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
          onPress={() => navigation.navigate('Badges')}
        >
          <Text style={styles.sectionTitle}>My Badges</Text>
          <Ionicons name="chevron-forward" size={20} color="#718096" />
        </TouchableOpacity>
        
        <View style={styles.badgeCoinsContainer}>
          {/* Show earned badges first */}
          {recentBadges.map((badge) => (
            <TouchableOpacity 
              key={badge.id}
              style={[
                styles.badgeCoin,
                { 
                  backgroundColor: badge.status === 'completed' 
                    ? colors.primary + '20' 
                    : colors.primary + '10'
                }
              ]}
              onPress={() => navigation.navigate('Badges')}
            >
              <Text style={styles.badgeCoinEmoji}>{badge.icon}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Show placeholder coins for badges not earned yet */}
          {Array.from({ length: Math.max(0, 3 - recentBadges.length) }).map((_, index) => (
            <View key={`placeholder-${index}`} style={styles.badgeCoinPlaceholder}>
              <Text style={styles.badgeCoinPlaceholderText}>?</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Training Courses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Training Courses</Text>
        
        {/* Flash Floods - Available with real-time progress */}
        <TouchableOpacity 
          style={styles.courseCard}
          onPress={() => handleCardPress('Flash Floods')}
          activeOpacity={0.8}
        >
          <View style={styles.courseHeader}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🌊</Text>
            </View>
            <View style={styles.courseTitleSection}>
              <Text style={styles.courseTitle}>Flash Floods</Text>
              <Text style={[styles.courseLevel, courseProgress > 0 && styles.activeCourseLevel]}>
                {courseProgress > 0 ? `${courseProgress}% Complete` : '🎮 Available'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.courseDescription}>
            Master flash flood preparedness through interactive scenarios covering preparation, response, and recovery phases.
          </Text>
          
          {/* Progress Bar - Updates immediately */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercent}>{courseProgress}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[
                styles.progressBar, 
                { 
                  width: `${courseProgress}%`,
                  backgroundColor: courseProgress === 100 ? '#10b981' : '#4caf50'
                }
              ]} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.startButton,
              courseProgress === 100 && styles.completedButton
            ]}
            onPress={() => handleCardPress('Flash Floods')}
          >
            <Text style={styles.startButtonText}>
              {courseProgress === 100 ? '🏆 Review Course' : courseProgress > 0 ? '▶️ Continue' : '🚀 Start Course'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

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
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  badgeCoinsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  
  badgeCoin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  badgeCoinEmoji: {
    fontSize: 28,
  },
  
  badgeCoinPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  
  badgeCoinPlaceholderText: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  
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
    borderLeftColor: colors.secondary || '#6b7280',
  },
  
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
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
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  
  activeCourseLevel: {
    color: colors.primary,
    backgroundColor: colors.primaryLight || colors.primary + '20',
  },
  
  courseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  
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
  
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  
  completedButton: {
    backgroundColor: '#10b981', 
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