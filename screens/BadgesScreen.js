import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BadgeService } from '../services/badgeService';
import { supabase } from '../lib/supabase'; // Adjust path

const { width } = Dimensions.get('window');

const BadgesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [badges, setBadges] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const categories = [
    { id: 'all', name: 'All', icon: '⭐', color: '#6b7280' },
    { id: 'responder', name: 'Responder', icon: '🚨', color: '#dc2626' },
    { id: 'safety', name: 'Safety', icon: '🛡️', color: '#ea580c' },
    { id: 'learning', name: 'Learning', icon: '📚', color: '#7c3aed' },
    { id: 'community', name: 'Community', icon: '🤝', color: '#16a34a' },
  ];

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadBadges();
      loadUserStats();
    }
  }, [currentUser, selectedCategory]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadBadges = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const badgeData = await BadgeService.getBadgesByCategory(currentUser.id, selectedCategory);
      setBadges(badgeData);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!currentUser) return;

    try {
      const stats = await BadgeService.getUserStats(currentUser.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBadges();
    await loadUserStats();
    setRefreshing(false);
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

  const BadgeCard = ({ badge }) => (
    <TouchableOpacity 
      style={[styles.badgeCard, { opacity: badge.status === 'locked' ? 0.6 : 1 }]}
      onPress={() => navigation.navigate('BadgeDetail', { badgeId: badge.id })}
    >
      <View style={styles.badgeHeader}>
        <View style={[styles.badgeIconContainer, { backgroundColor: badge.color + '20' }]}>
          <Text style={styles.badgeIcon}>{badge.icon}</Text>
        </View>
        <View style={styles.badgeLevel}>
          <Text style={styles.badgeLevelText}>Lvl {badge.level}</Text>
        </View>
      </View>
      
      <Text style={styles.badgeTitle}>{badge.title}</Text>
      <Text style={styles.badgeDescription}>{badge.description}</Text>
      
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(badge.progress / badge.maxProgress) * 100}%`,
                backgroundColor: badge.color 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {badge.progress}/{badge.maxProgress}
        </Text>
      </View>
      
      <View style={styles.badgeFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(badge.status) }]}>
          <Text style={styles.statusText}>{getStatusText(badge.status)}</Text>
        </View>
        <Text style={styles.xpReward}>+{badge.xpReward} XP</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading badges...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = badges.filter(b => b.status === 'completed').length;
  const totalCount = badges.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Badges</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userStats?.badges_earned || 0}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userStats?.total_xp || 0}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userStats?.courses_completed || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.activeCategoryChip
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Badges Grid */}
      <ScrollView 
        style={styles.badgesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  categoryContainer: {
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 20,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#3b82f6',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
  },
  activeCategoryText: {
    color: 'white',
  },
  badgesContainer: {
    flex: 1,
    padding: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: (width - 52) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 20,
  },
  badgeLevel: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeLevelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'right',
  },
  badgeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  xpReward: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
});

export default BadgesScreen;