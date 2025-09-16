// screens/BadgeDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BadgeService } from '../services/badgeService';
import { supabase } from '../lib/supabase';

const BadgeDetailScreen = ({ route, navigation }) => {
  const { badgeId } = route.params;
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadBadgeDetails();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadBadgeDetails = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const badgeDetails = await BadgeService.getBadgeDetails(currentUser.id, badgeId);
      setBadge(badgeDetails);
    } catch (error) {
      console.error('Error loading badge details:', error);
      Alert.alert('Error', 'Failed to load badge details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'in_progress': return '#f59e0b';
      case 'available': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'available': return 'Available';
      default: return 'Locked';
    }
  };

  const handleStartLearning = (requirementId) => {
    // Navigate to the specific learning module
    // You'll need to implement navigation based on your module structure
    Alert.alert('Start Learning', `Navigate to ${requirementId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading badge details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!badge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Badge Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Badge not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercentage = (badge.progress / badge.maxProgress) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Badge Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Badge Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: badge.color + '10' }]}>
          <View style={[styles.badgeIconLarge, { backgroundColor: badge.color + '20' }]}>
            <Text style={styles.badgeIconText}>{badge.icon}</Text>
          </View>
          
          <Text style={styles.badgeTitle}>{badge.title}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(badge.status) }]}>
            <Text style={styles.statusText}>{getStatusText(badge.status)}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: badge.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {badge.progress}/{badge.maxProgress} ({Math.round(progressPercentage)}%)
            </Text>
          </View>
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {badge.requirementDetails && badge.requirementDetails.map((requirement, index) => (
            <View key={index} style={styles.requirementCard}>
              <View style={styles.requirementHeader}>
                <View style={styles.requirementInfo}>
                  <Text style={styles.requirementTitle}>
                    {requirement.title || `Requirement ${index + 1}`}
                  </Text>
                  <Text style={styles.requirementType}>
                    {requirement.type === 'module_count' 
                      ? `${requirement.completed}/${requirement.required} completed`
                      : requirement.type
                    }
                  </Text>
                </View>
                <View style={styles.requirementStatus}>
                  {requirement.completed || (requirement.type === 'module_count' && requirement.completed >= requirement.required) ? (
                    <View style={styles.completedIcon}>
                      <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.startButton}
                      onPress={() => handleStartLearning(requirement.id)}
                    >
                      <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {requirement.completedAt && (
                <Text style={styles.completedDate}>
                  Completed: {new Date(requirement.completedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Reward Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward</Text>
          <View style={styles.rewardCard}>
            <Text style={styles.xpReward}>+{badge.xpReward} XP</Text>
            <Text style={styles.rewardDescription}>
              Earn {badge.xpReward} experience points upon completion
            </Text>
          </View>
        </View>

        {/* Badge Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{badge.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Level:</Text>
              <Text style={styles.infoValue}>{badge.level}</Text>
            </View>
            {badge.completedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Completed:</Text>
                <Text style={styles.infoValue}>
                  {new Date(badge.completedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 20,
  },
  badgeIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeIconText: {
    fontSize: 40,
  },
  badgeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
  requirementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requirementInfo: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  requirementType: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  requirementStatus: {
    marginLeft: 12,
  },
  completedIcon: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  completedDate: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 8,
  },
  rewardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  xpReward: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
    textTransform: 'capitalize',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    textTransform: 'capitalize',
  },
});

export default BadgeDetailScreen;