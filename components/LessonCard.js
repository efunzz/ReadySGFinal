import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

const LessonCard = ({ lesson, onPress, getDifficultyColor }) => {
  return (
    <TouchableOpacity 
      style={styles.lessonCard}
      onPress={() => onPress(lesson)}
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
};

const styles = StyleSheet.create({
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
    // Styled via Ionicons
  },
});

export default LessonCard;