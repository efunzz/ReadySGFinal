import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import LessonCard from '../components/LessonCard'; 

import { BadgeService } from '../services/badgeService';
import { supabase } from '../lib/supabase';

const FlashFloodLessonsScreen = ({ navigation }) => {
  const [lessons, setLessons] = useState([
    {
      id: 'before',
      title: 'Before Flash Flood',
      subtitle: 'Preparation & Warning Signs',
      description: 'Learn how to prepare and respond to flash flood warnings',
      icon: '🏠',
      scenarios: 3,
      completed: false, 
    },
    {
      id: 'during',
      title: 'During Flash Flood',
      subtitle: 'Emergency Response',
      description: 'Critical decision-making during active flooding',
      icon: '🌊',
      scenarios: 3,
      completed: false, // Will be updated from backend
    },
    {
      id: 'after',
      title: 'After Flash Flood',
      subtitle: 'Recovery & Safety',
      description: 'Safe cleanup and recovery procedures',
      icon: '🧹',
      scenarios: 3,
      completed: false, // Will be updated from backend
    }
  ]);
  useEffect(() => {
    loadLessonProgress();
  }, []);
  
  const loadLessonProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check which modules are completed
        const moduleKeys = ['flash_flood_before', 'flash_flood_during', 'flash_flood_after'];
        
        for (let i = 0; i < moduleKeys.length; i++) {
          const { data, error } = await supabase
            .from('user_learning_progress')
            .select('status')
            .eq('user_id', user.id)
            .eq('module_id', (
              await supabase
                .from('learning_modules')
                .select('id')
                .eq('module_key', moduleKeys[i])
                .single()
            ).data?.id)
            .single();
  
          if (data?.status === 'completed') {
            setLessons(prev => prev.map(lesson => 
              lesson.id === ['before', 'during', 'after'][i] 
                ? { ...lesson, completed: true }
                : lesson
            ));
          }
        }
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error);
      // Continue without progress - not critical
    }
  };

  const handleLessonPress = (lesson) => {
    navigation.navigate('FlashFloodSimulator', { scenario: lesson.id });
  };

  return (
    <View style={styles.container}>
      {/* Header with primary color extending to notch */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Flash Flood Training</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Complete Course Overview</Text>
          <Text style={styles.overviewDescription}>
            Master flash flood preparedness with three comprehensive scenarios covering preparation, response, and recovery phases.
          </Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>9</Text>
              <Text style={styles.statLabel}>Scenarios</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {lessons.filter(lesson => lesson.completed).length}/{lessons.length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Lessons */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Choose Your Lesson</Text>
          {lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              onPress={handleLessonPress}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background?.secondary || '#f9fafb',
  },
  
  // Header background that extends to notch
  headerBackground: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  safeArea: {
    // SafeAreaView handles the notch padding
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },

  content: {
    flex: 1,
  },

  overviewCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text?.primary || '#1f2937',
    marginBottom: 8,
  },

  overviewDescription: {
    fontSize: 14,
    color: colors.text?.secondary || '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },

  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#e5e7eb',
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },

  statLabel: {
    fontSize: 12,
    color: colors.text?.secondary || '#6b7280',
    marginTop: 2,
  },

  lessonsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text?.primary || '#1f2937',
    marginBottom: 16,
  },

  bottomPadding: {
    height: 100,
  },
});

export default FlashFloodLessonsScreen;