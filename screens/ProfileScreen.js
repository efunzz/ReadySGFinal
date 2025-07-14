import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

//Import Colors
import { colors } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  //Needs to be dynamic based on users
  const userStats = {
    missionsCompleted: 8,
    quizScore: 92,
    daysActive: 15,
    totalAchievements: 6
  };

  const achievements = [
    { name: 'First Responder', icon: '🚑', description: 'Completed first aid mission' },
    { name: 'Storm Survivor', icon: '⛈️', description: 'Mastered weather emergency prep' },
    { name: 'Quiz Master', icon: '🧠', description: 'Scored 90%+ on safety quiz' },
    { name: 'Preparedness Pro', icon: '🎯', description: 'Built complete emergency kit' },
    { name: 'Community Helper', icon: '🤝', description: 'Shared resources with others' },
    { name: 'Early Bird', icon: '🌅', description: 'Completed morning safety check' },
  ];

  const profileMenuItems = [
    { title: 'Personal Information', icon: '👤', subtitle: 'Update your details' },
    { title: 'Emergency Contacts', icon: '📞', subtitle: 'Manage your contacts' },
    { title: 'Notification Settings', icon: '🔔', subtitle: 'Alert preferences' },
    { title: 'Location Settings', icon: '📍', subtitle: 'Your area preferences' },
    { title: 'Privacy & Security', icon: '🔒', subtitle: 'Account security' },
    { title: 'Help & Support', icon: '❓', subtitle: 'Get assistance' },
    { title: 'About ReadySG', icon: 'ℹ️', subtitle: 'App information' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>J</Text>
          </View>
          <TouchableOpacity style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>James Chen</Text>
        <Text style={styles.userLocation}>📍 Toa Payoh, Singapore</Text>
        <Text style={styles.joinDate}>Member since Jan 2025</Text>
      </View>

      {/* Stats Cards Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statsCard}>
          <Text style={styles.statsNumber}>{userStats.totalAchievements}</Text>
          <Text style={styles.statsLabel}>Achievements</Text>
          <Text style={styles.statsIcon}>🏆</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.statsCard}>
          <Text style={styles.statsNumber}>{userStats.missionsCompleted}</Text>
          <Text style={styles.statsLabel}>Missions</Text>
          <Text style={styles.statsIcon}>🎯</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Achievements Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementScroll}>
          {achievements.slice(0, 4).map((achievement, index) => (
            <TouchableOpacity key={index} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDesc}>{achievement.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Progress Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Emergency Kit</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '85%' }]} />
            </View>
            <Text style={styles.progressPercent}>85%</Text>
          </View>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Safety Knowledge</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '92%' }]} />
            </View>
            <Text style={styles.progressPercent}>92%</Text>
          </View>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Mission Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '67%' }]} />
            </View>
            <Text style={styles.progressPercent}>8/12</Text>
          </View>
        </View>
      </View>

      {/* Profile Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        {profileMenuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: colors.text.light,
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 14,
    color: '#a0aec0',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsIcon: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  achievementScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 10,
    color: colors.text.light,
    textAlign: 'center',
    lineHeight: 12,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.status.success,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    color: colors.text.light,
    alignSelf: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.text.light,
  },
  menuArrow: {
    fontSize: 20,
    color: '#cbd5e0',
  },
  logoutButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e53e3e',
  },
  bottomPadding: {
    height: 40,
  },
});