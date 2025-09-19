import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { BadgeService } from '../../services/badgeService';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/theme';

const BadgesScreen = ({ navigation }) => {
  const [badges, setBadges] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Show only 3 key badges - flood_expert first since it's the active one
  const keyBadgeIds = ['flood_expert', 'first_aider', 'knowledge_seeker'];

  useEffect(() => {
    getCurrentUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        loadData();
      }
    }, [currentUser])
  );

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      console.log('🔄 Refreshing badges for user:', currentUser.id);
      
      const allBadges = await BadgeService.getUserBadges(currentUser.id);
      
      console.log('📊 All badges loaded:', allBadges);
      
      // Filter to show only key badges and sort with flood_expert first
      const keyBadges = allBadges
        .filter(badge => keyBadgeIds.includes(badge.id))
        .sort((a, b) => {
          // Put flood_expert first, then others in original order
          if (a.id === 'flood_expert') return -1;
          if (b.id === 'flood_expert') return 1;
          return keyBadgeIds.indexOf(a.id) - keyBadgeIds.indexOf(b.id);
        });
      console.log('🎯 Key badges filtered and sorted:', keyBadges);
      
      setBadges(keyBadges);
    } catch (error) {
      console.error('❌ Error loading data:', error);
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

  const BadgeCard = ({ badge }) => {
    const progressPercentage = Math.round((badge.progress / badge.maxProgress) * 100);
    
    return (
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
                  width: `${progressPercentage}%`,
                  backgroundColor: getStatusColor(badge.status)
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {badge.progress}/{badge.maxProgress} ({progressPercentage}%)
          </Text>
        </View>
        
        {/* Status indicator */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(badge.status) }]}>
          <Text style={styles.statusText}>
            {badge.status === 'completed' ? '✅ Complete' : 
             badge.status === 'in_progress' ? '🔄 In Progress' : 
             '🔒 Available'}
          </Text>
        </View>
        
        <Text style={styles.xpText}>+{badge.xpReward} XP</Text>
      </TouchableOpacity>
    );
  };

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


        {/* Badge Cards */}
        {badges.length > 0 ? (
          badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))
        ) : (
          <View style={styles.noBadgesContainer}>
            <Text style={styles.noBadgesText}>No badges available yet</Text>
            <Text style={styles.noBadgesSubtext}>Complete learning modules to earn badges!</Text>
          </View>
        )}
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  xpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  noBadgesContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  noBadgesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text?.secondary || '#6b7280',
    marginBottom: 8,
  },
  noBadgesSubtext: {
    fontSize: 14,
    color: colors.text?.secondary || '#6b7280',
    textAlign: 'center',
  },
});

export default BadgesScreen;