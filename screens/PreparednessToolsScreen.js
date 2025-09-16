import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmergencyKitCard from '../components/EmergencyKitCard';
import { colors } from '../constants/theme';
import { AIChatbotService } from '../services/aiChatbotService';

export default function PreparednessToolsScreen({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [collectedItems, setCollectedItems] = useState({});
  const [selectedTool, setSelectedTool] = useState('collection');
  const [showCamera, setShowCamera] = useState(null);
  const [streak, setStreak] = useState(7);
  
  // CHAT STATE
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Emergency AI Chatbot. I can help you with preparedness questions, explain quiz answers, or suggest items for your emergency kit. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TOOLS ARRAY - Updated with AI Chatbot
  const tools = [
    { id: 'collection', name: 'Kit Collection', icon: '🎴' },
    { id: 'quiz', name: 'Safety Quiz', icon: '🧠' },
    { id: 'chat', name: 'AI Chatbot', icon: '🤖' },
  ];

  // Emergency kit items with gamification data
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

  // CHAT FUNCTIONS
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // Build user context for AI
      const userContext = {
        collectedItems: getCollectionStats(),
        currentScreen: 'preparedness_tools',
        location: 'Singapore',
        totalItems: [...essentialItems, ...optionalItems].length,
        essentialItems: essentialItems.length,
        streak: streak
      };

      // Use AI Chatbot service
      const botResponse = await AIChatbotService.getResponse(currentInput, userContext);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later, or contact emergency services at 995 for urgent matters.",
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // CHAT RENDER FUNCTION
  const renderChat = () => (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>🤖 AI Chatbot</Text>
        <Text style={styles.chatSubtitle}>Ask me anything about emergency preparedness!</Text>
      </View>
  
      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {chatMessages.map((item) => (
          <View 
            key={item.id}
            style={[
              styles.messageWrapper,
              item.isBot ? styles.botMessageWrapper : styles.userMessageWrapper
            ]}
          >
            <View style={[
              styles.messageBubble,
              item.isBot ? styles.botMessage : styles.userMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.isBot ? styles.botMessageText : styles.userMessageText
              ]}>
                {item.text}
              </Text>
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>🤖 AI Chatbot is thinking...</Text>
          </View>
        )}
      </ScrollView>
  
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about emergency preparedness..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // EXISTING FUNCTIONS
  const handleCollectItem = (itemId) => {
    setShowCamera(itemId);
  };

  const confirmCollection = (itemId) => {
    setCollectedItems(prev => ({ ...prev, [itemId]: true }));
    setShowCamera(null);
    
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
      <View style={styles.toolContent}>
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
      </View>
    );
  };

  const renderQuiz = () => (
    <View style={styles.toolContent}>
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
    </View>
  );

  const renderContent = () => {
    switch (selectedTool) {
      case 'collection': return renderCollection();
      case 'quiz': return renderQuiz();
      case 'chat': return renderChat();
      default: return renderCollection();
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header that scrolls with content - matching MenuScreen style */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>Preparedness Tools</Text>
            <Text style={styles.subtitle}>Build your emergency readiness</Text>
          </View>
        </SafeAreaView>
      </View>
      
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

      <View style={styles.bottomPadding} />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header styling that matches MenuScreen
  headerBackground: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  
  safeArea: {
    // SafeAreaView handles the notch padding
  },
  
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
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

  // CHAT STYLES
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  chatHeader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12, 
    marginBottom: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatTitle: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2, 
  },
  chatSubtitle: {
    fontSize: 12, 
    color: '#718096',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1, 
    marginBottom: 100, 
  },
  messageWrapper: {
    marginBottom: 8, 
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botMessage: {
    backgroundColor: '#e2e8f0',
    borderBottomLeftRadius: 6,
  },
  userMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botMessageText: {
    color: '#2d3748',
  },
  userMessageText: {
    color: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 12,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // COLLECTION STYLES
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
    paddingHorizontal: 5,
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

  // QUIZ STYLES
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

  bottomPadding: {
    height: 100,
  },
});