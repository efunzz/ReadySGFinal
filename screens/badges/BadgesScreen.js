import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BadgeService } from '../../services/badgeService';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/theme';

const BadgesScreen = ({ navigation }) => {
  const [badges, setBadges] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Show only 3 key badges
  const keyBadgeIds = ['flood_expert', 'first_aider', 'knowledge_seeker'];

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const [allBadges, stats] = await Promise.all([
        BadgeService.getUserBadges(currentUser.id),
        BadgeService.getUserStats(currentUser.id)
      ]);
      
      // Filter to show only key badges
      const keyBadges = allBadges.filter(badge => keyBadgeIds.includes(badge.id));
      setBadges(keyBadges);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const BadgeCard = ({ badge }) => (
    <TouchableOpacity 
      style={styles.badgeCard}
      onPress={() => navigation.navigate('BadgeDetail', { badgeId: badge.id })}
    >
      <View style={styles.badgeIcon}>
        <Text style={styles.badgeEmoji}>{badge.icon}</Text>
      </View>
      
      <Text style={styles.badgeTitle}>{badge.title}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(badge.progress / badge.maxProgress) * 100}%`,
                backgroundColor: getStatusColor(badge.status)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {badge.progress}/{badge.maxProgress}
        </Text>
      </View>
      
      <Text style={styles.xpText}>+{badge.xpReward} XP</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with primary color extending to notch */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Badges</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        style={styles.badgesScrollView}
        contentContainerStyle={styles.badgesContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats?.total_xp || 0}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats?.badges_earned || 0}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats?.courses_completed || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Badge Cards */}
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text?.secondary || '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  badgesScrollView: {
    flex: 1,
  },
  badgesContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100, // Extra padding for tab bar
  },
  badgeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text?.primary || '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border || '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
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
  xpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default BadgesScreen;