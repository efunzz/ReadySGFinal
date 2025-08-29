import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import EmergencyKitCard from '../components/EmergencyKitCard'; // Import the card component

//Import colors
import { colors } from '../constants/theme';

export default function PreparednessToolsScreen({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [collectedItems, setCollectedItems] = useState({});
  const [selectedTool, setSelectedTool] = useState('collection'); // Changed default
  const [showCamera, setShowCamera] = useState(null);
  const [streak, setStreak] = useState(7);

  const tools = [
    { id: 'collection', name: 'Kit Collection', icon: '🎴' }, // Changed from checklist
    { id: 'quiz', name: 'Safety Quiz', icon: '🧠' },
    // Removed progress tab as requested
  ];

  // Updated emergency kit items with gamification data
  const essentialItems = [
    { id: 'torchlight', name: 'Torchlight', description: 'Essential for power outages', rarity: 'common', category: 'essential' },
    { id: 'batteries', name: 'Extra Batteries', description: 'Power your devices when grid fails', rarity: 'common', category: 'essential' },
    { id: 'medication', name: 'Personal Medication', description: 'Life-saving prescriptions', rarity: 'rare', category: 'essential' },
    { id: 'documents', name: 'Waterproof Documents', description: 'ID, insurance, emergency contacts', rarity: 'uncommon', category: 'essential' },
    { id: 'whistle', name: 'Emergency Whistle', description: 'Signal for help when trapped', rarity: 'common', category: 'essential' },
    { id: 'firstaid', name: 'First Aid Kit', description: 'Treat injuries and save lives', rarity: 'rare', category: 'essential' },
    { id: 'childcare', name: 'Childcare Supplies', description: 'Special needs for little ones', rarity: 'uncommon', category: 'essential' },
    { id: 'mask', name: 'N95 Mask', description: 'Protection from smoke and debris', rarity: 'common', category: 'essential' },
  ];

  const optionalItems = [
    { id: 'contacts', name: 'Contact List', description: 'Important phone numbers written down', rarity: 'common', category: 'optional' },
    { id: 'cash', name: 'Emergency Cash', description: 'When cards don\'t work', rarity: 'uncommon', category: 'optional' },
    { id: 'water', name: 'Water & Food', description: '3 days of survival supplies', rarity: 'rare', category: 'optional' },
    { id: 'clothing', name: 'Spare Clothing', description: 'Clean clothes for recovery', rarity: 'common', category: 'optional' },
    { id: 'emergency_numbers', name: 'Emergency Numbers', description: 'Quick access to 995 and services', rarity: 'common', category: 'optional' },
  ];

  const quizQuestions = [
    {
      question: "What should you do if you're caught in a flash flood while driving?",
      options: ["Drive faster through the water", "Abandon your car and seek higher ground", "Wait in the car", "Turn around slowly"],
      correct: 1
    },
    {
      question: "How much water should you store per person per day?",
      options: ["1 cup", "1 liter", "1 gallon", "2 gallons"],
      correct: 2
    }
  ];

  const handleCollectItem = (itemId) => {
    setShowCamera(itemId);
  };

  const confirmCollection = (itemId) => {
    setCollectedItems(prev => ({ ...prev, [itemId]: true }));
    setShowCamera(null);
    
    // Show celebration alert
    Alert.alert(
      "🎉 Item Collected!",
      "Great job! You're one step closer to being fully prepared!",
      [{ text: "Awesome!", style: "default" }]
    );
  };

  const getCollectionStats = () => {
    const allItems = [...essentialItems, ...optionalItems];
    const collected = allItems.filter(item => collectedItems[item.id]).length;
    const essentialCollected = essentialItems.filter(item => collectedItems[item.id]).length;
    return { 
      collected, 
      total: allItems.length, 
      essentialCollected,
      essentialTotal: essentialItems.length,
      percentage: Math.round((collected / allItems.length) * 100) 
    };
  };

  const renderCollection = () => {
    const stats = getCollectionStats();
    
    return (
      <ScrollView style={styles.toolContent} showsVerticalScrollIndicator={false}>
        {/* Collection Header */}
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionTitle}>🎮 Emergency Kit Collection</Text>
          <Text style={styles.collectionSubtitle}>
            Collect real emergency items to unlock your preparedness cards!
          </Text>
          
          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.collected}/{stats.total}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.percentage}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Collection Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${stats.percentage}%` }]} />
            </View>
          </View>
        </View>

        {/* Essential Items Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            ⚡ Essential Kit ({stats.essentialCollected}/{stats.essentialTotal})
          </Text>
          <View style={styles.cardsGrid}>
            {essentialItems.map((item) => (
              <EmergencyKitCard
                key={item.id}
                item={item}
                isCollected={collectedItems[item.id]}
                onCollect={handleCollectItem}
              />
            ))}
          </View>
        </View>

        {/* Optional Items Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            🎁 Bonus Items ({optionalItems.filter(item => collectedItems[item.id]).length}/{optionalItems.length})
          </Text>
          <View style={styles.cardsGrid}>
            {optionalItems.map((item) => (
              <EmergencyKitCard
                key={item.id}
                item={item}
                isCollected={collectedItems[item.id]}
                onCollect={handleCollectItem}
              />
            ))}
          </View>
        </View>

        {/* Achievement Section */}
        {stats.percentage === 100 && (
          <View style={styles.achievementBanner}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementTitle}>Preparedness Master!</Text>
            <Text style={styles.achievementDesc}>You've collected everything! Ready for any emergency! 🎉</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderQuiz = () => (
    <ScrollView style={styles.toolContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.toolDescription}>
        Test your emergency preparedness knowledge:
      </Text>
      
      {quizQuestions.map((quiz, index) => (
        <View key={index} style={styles.quizCard}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <Text style={styles.questionText}>{quiz.question}</Text>
          
          {quiz.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={styles.quizOption}
              onPress={() => console.log(`Selected: ${option}`)}
            >
              <View style={styles.optionCircle}>
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + optionIndex)}
                </Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderContent = () => {
    switch (selectedTool) {
      case 'collection': return renderCollection();
      case 'quiz': return renderQuiz();
      default: return renderCollection();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Preparedness Tools</Text>
      <Text style={styles.pageSubtitle}>Build your emergency readiness</Text>
      
      {/* Tool Tabs */}
      <View style={styles.toolTabs}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              styles.toolTab,
              selectedTool === tool.id && styles.activeToolTab
            ]}
            onPress={() => setSelectedTool(tool.id)}
          >
            <Text style={styles.toolIcon}>{tool.icon}</Text>
            <Text style={[
              styles.toolText,
              selectedTool === tool.id && styles.activeToolText
            ]}>
              {tool.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}

      {/* Camera Modal */}
      <Modal
        visible={showCamera !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCamera(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cameraModal}>
            <Text style={styles.modalTitle}>📸 Collect This Item!</Text>
            <View style={styles.cameraArea}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraInstructions}>
                Take a photo of your item{'\n'}then confirm to unlock!
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => confirmCollection(showCamera)}
              >
                <Text style={styles.confirmButtonText}>✓ I Have This Item!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCamera(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  toolTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  toolTab: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeToolTab: {
    backgroundColor: colors.primary,
  },
  toolIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  toolText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeToolText: {
    color: 'white',
  },
  toolContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  toolDescription: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 20,
    textAlign: 'center',
  },

  // NEW COLLECTION STYLES
  collectionHeader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  collectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5, // Small padding to center the cards perfectly
  },
  achievementBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#a16207',
    textAlign: 'center',
  },

  // CAMERA MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraArea: {
    backgroundColor: '#f7fafc',
    height: 160,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  cameraInstructions: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
  modalActions: {
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },

  // EXISTING QUIZ STYLES
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '600',
    marginBottom: 16,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  optionText: {
    fontSize: 14,
    color: '#4a5568',
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});