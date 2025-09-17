import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BadgeService } from '../services/badgeService';
import { supabase } from '../lib/supabase';
import { colors } from '../constants/theme';

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
      case 'completed': return colors.success || '#10b981';
      case 'in_progress': return colors.warning || '#f59e0b';
      default: return colors.primary;
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
    if (requirementId === 'flash_flood_simulator') {
      navigation.navigate('Menu', { 
        screen: 'FlashFloodSimulator',
        params: { scenario: 'during' } 
      });
    } else {
      Alert.alert('Coming Soon', `${requirementId} will be available soon!`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBackground}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Badge Details</Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!badge) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBackground}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Badge Details</Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Badge not found</Text>
        </View>
      </View>
    );
  }

  const progressPercentage = (badge.progress / badge.maxProgress) * 100;

  return (
    <View style={styles.container}>
      {/* Header with primary color extending to notch */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{badge.title}</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Badge Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badgeIconLarge}>
            <Text style={styles.badgeIconText}>{badge.icon}</Text>
          </View>
          
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(badge.status) }]}>
            <Text style={styles.statusText}>{getStatusText(badge.status)}</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: getStatusColor(badge.status)
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {badge.progress}/{badge.maxProgress} ({Math.round(progressPercentage)}%)
          </Text>
        </View>

        {/* Requirements Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Requirements</Text>
          {badge.requirementDetails && badge.requirementDetails.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.requirementInfo}>
                <Text style={styles.requirementTitle}>
                  {requirement.title || `Requirement ${index + 1}`}
                </Text>
                {requirement.type === 'module_count' && (
                  <Text style={styles.requirementSubtext}>
                    {requirement.completed}/{requirement.required} completed
                  </Text>
                )}
              </View>
              <View style={styles.requirementAction}>
                {requirement.completed || (requirement.type === 'module_count' && requirement.completed >= requirement.required) ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.success || '#10b981'} />
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
          ))}
        </View>

        {/* Reward Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reward</Text>
          <View style={styles.rewardContent}>
            <Text style={styles.xpReward}>+{badge.xpReward} XP</Text>
            <Text style={styles.rewardDescription}>
              Experience points earned upon completion
            </Text>
          </View>
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
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text?.secondary || '#6b7280',
  },
  
  errorText: {
    fontSize: 16,
    color: colors.status?.error || '#ef4444',
    textAlign: 'center',
  },

  content: {
    flex: 1,
  },

  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },

  badgeIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  badgeIconText: {
    fontSize: 40,
  },

  badgeDescription: {
    fontSize: 16,
    color: colors.text?.secondary || '#6b7280',
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

  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text?.primary || '#1f2937',
    marginBottom: 16,
  },

  progressBar: {
    height: 8,
    backgroundColor: colors.border || '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  progressText: {
    fontSize: 14,
    color: colors.text?.secondary || '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
  },

  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#e5e7eb',
  },

  requirementInfo: {
    flex: 1,
  },

  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text?.primary || '#1f2937',
  },

  requirementSubtext: {
    fontSize: 12,
    color: colors.text?.secondary || '#6b7280',
    marginTop: 2,
  },

  requirementAction: {
    marginLeft: 12,
  },

  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  rewardContent: {
    alignItems: 'center',
  },

  xpReward: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },

  rewardDescription: {
    fontSize: 14,
    color: colors.text?.secondary || '#6b7280',
    textAlign: 'center',
  },

  bottomPadding: {
    height: 100,
  },
});

export default BadgeDetailScreen;