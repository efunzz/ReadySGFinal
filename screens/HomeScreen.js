import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const navigateToTab = (tabName) => {
    navigation.navigate(tabName);
  };

  const currentDate = new Date().toLocaleDateString('en-SG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, James!</Text>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.location}>📍 Toa Payoh, Singapore</Text>
      </View>

      {/* Weather Alert Card */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertIcon}>⛈️</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Weather Alert</Text>
            <Text style={styles.alertStatus}>Thunderstorm Warning</Text>
          </View>
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>ACTIVE</Text>
          </View>
        </View>
        <Text style={styles.alertDescription}>
          Heavy rain and thunderstorms expected from 2-6 PM today. Stay indoors and avoid flood-prone areas.
        </Text>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigateToTab('Menu')}
          >
            <Text style={styles.quickActionIcon}>🎯</Text>
            <Text style={styles.quickActionTitle}>Learn</Text>
            <Text style={styles.quickActionSubtitle}>Emergency Training</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigateToTab('Like')}
          >
            <Text style={styles.quickActionIcon}>🏠</Text>
            <Text style={styles.quickActionTitle}>Resources</Text>
            <Text style={styles.quickActionSubtitle}>Find Shelters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigateToTab('Cart')}
          >
            <Text style={styles.quickActionIcon}>✅</Text>
            <Text style={styles.quickActionTitle}>Tools</Text>
            <Text style={styles.quickActionSubtitle}>Check Preparedness</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigateToTab('Profile')}
          >
            <Text style={styles.quickActionIcon}>👤</Text>
            <Text style={styles.quickActionTitle}>Profile</Text>
            <Text style={styles.quickActionSubtitle}>View Progress</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Safety Tip */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Safety Tip</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Flash Flood Safety</Text>
            <Text style={styles.tipDescription}>
              Never drive through flooded roads. Just 6 inches of moving water can knock you down, and 2 feet can carry away your vehicle.
            </Text>
          </View>
        </View>
      </View>

      {/* Preparedness Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Preparedness</Text>
        <View style={styles.preparednessCard}>
          <View style={styles.preparednessHeader}>
            <Text style={styles.preparednessScore}>85%</Text>
            <View style={styles.preparednessInfo}>
              <Text style={styles.preparednessTitle}>Overall Readiness</Text>
              <Text style={styles.preparednessSubtitle}>You're well prepared! 🎉</Text>
            </View>
          </View>
          
          <View style={styles.preparednessBreakdown}>
            <View style={styles.preparednessItem}>
              <Text style={styles.preparednessLabel}>Emergency Kit</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '85%' }]} />
              </View>
              <Text style={styles.progressText}>85%</Text>
            </View>
            
            <View style={styles.preparednessItem}>
              <Text style={styles.preparednessLabel}>Knowledge</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '92%' }]} />
              </View>
              <Text style={styles.progressText}>92%</Text>
            </View>
            
            <View style={styles.preparednessItem}>
              <Text style={styles.preparednessLabel}>Training</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '78%' }]} />
              </View>
              <Text style={styles.progressText}>78%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>🏆</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Achievement Unlocked!</Text>
              <Text style={styles.activityDesc}>Completed "Flash Flood Safety" mission</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>✅</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Kit Updated</Text>
              <Text style={styles.activityDesc}>Added flashlight to emergency kit</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>📚</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Quiz Completed</Text>
              <Text style={styles.activityDesc}>Scored 95% on preparedness quiz</Text>
              <Text style={styles.activityTime}>3 days ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.emergencyContacts}>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>🚨 Emergency Services</Text>
            <Text style={styles.emergencyNumber}>995</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>🚑 Non-Emergency</Text>
            <Text style={styles.emergencyNumber}>1777</Text>
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
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#a0aec0',
  },
  alertCard: {
    backgroundColor: '#fff8f1',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 2,
  },
  alertStatus: {
    fontSize: 14,
    color: '#b45309',
  },
  alertBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  alertDescription: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
  },
  preparednessCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  preparednessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  preparednessScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 16,
  },
  preparednessInfo: {
    flex: 1,
  },
  preparednessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  preparednessSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  preparednessBreakdown: {
    gap: 16,
  },
  preparednessItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preparednessLabel: {
    fontSize: 14,
    color: '#4a5568',
    width: 80,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
    width: 40,
    textAlign: 'right',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 16,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 10,
    color: '#a0aec0',
  },
  emergencyContacts: {
    gap: 12,
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 20,
  },
});