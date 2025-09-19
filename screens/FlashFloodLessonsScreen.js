import React from 'react';
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

const FlashFloodLessonsScreen = ({ navigation }) => {
  const lessons = [
    {
      id: 'before',
      title: 'Before Flash Flood',
      subtitle: 'Preparation & Warning Signs',
      description: 'Learn how to prepare and respond to flash flood warnings',
      icon: '🏠',
      difficulty: 'Beginner',
      duration: '5-7 min',
      scenarios: 3,
      completed: false,
    },
    {
      id: 'during',
      title: 'During Flash Flood',
      subtitle: 'Emergency Response',
      description: 'Critical decision-making during active flooding',
      icon: '🌊',
      difficulty: 'Intermediate',
      duration: '5-7 min',
      scenarios: 3,
      completed: false,
    },
    {
      id: 'after',
      title: 'After Flash Flood',
      subtitle: 'Recovery & Safety',
      description: 'Safe cleanup and recovery procedures',
      icon: '🧹',
      difficulty: 'Beginner',
      duration: '5-7 min',
      scenarios: 3,
      completed: false,
    }
  ];

  const handleLessonPress = (lesson) => {
    navigation.navigate('FlashFloodSimulator', { scenario: lesson.id });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return colors.success || '#10b981';
      case 'Intermediate': return colors.warning || '#f59e0b';
      case 'Advanced': return colors.status?.error || '#ef4444';
      default: return colors.primary;
    }
  };

  const LessonCard = ({ lesson }) => (
    <TouchableOpacity 
      style={styles.lessonCard}
      onPress={() => handleLessonPress(lesson.id)}
    >
      <View style={styles.lessonIcon}>
        <Text style={styles.lessonEmoji}>{lesson.icon}</Text>
      </View>
      
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>
        
        <View style={styles.lessonMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.text?.secondary || '#6b7280'} />
            <Text style={styles.metaText}>{lesson.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="play-outline" size={14} color={colors.text?.secondary || '#6b7280'} />
            <Text style={styles.metaText}>{lesson.scenarios} scenarios</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(lesson.difficulty) }]}>
              {lesson.difficulty}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.lessonAction}>
        {lesson.completed ? (
          <View style={styles.completedIcon}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success || '#10b981'} />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.text?.secondary || '#6b7280'} />
        )}
      </View>
    </TouchableOpacity>
  );

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
              <Text style={styles.statNumber}>20</Text>
              <Text style={styles.statLabel}>Min Total</Text>
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
              getDifficultyColor={getDifficultyColor}
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

  lessonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  lessonEmoji: {
    fontSize: 24,
  },

  lessonContent: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text?.primary || '#1f2937',
    marginBottom: 2,
  },

  lessonSubtitle: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
    fontWeight: '600',
  },

  lessonDescription: {
    fontSize: 13,
    color: colors.text?.secondary || '#6b7280',
    marginBottom: 8,
  },

  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  metaText: {
    fontSize: 12,
    color: colors.text?.secondary || '#6b7280',
    marginLeft: 4,
  },

  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 'auto',
  },

  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },

  lessonAction: {
    marginLeft: 12,
  },

  completedIcon: {
    // Already styled via Ionicons
  },

  bottomPadding: {
    height: 100,
  },
});

export default FlashFloodLessonsScreen;