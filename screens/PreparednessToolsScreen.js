import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmergencyKitCard from '../components/EmergencyKitCard';
import { colors } from '../constants/theme';
import { AIChatbotService } from '../services/aiChatbotService';
import { BadgeService } from '../services/badgeService';
import { supabase } from '../lib/supabase';

export default function PreparednessToolsScreen({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [collectedItems, setCollectedItems] = useState({});
  const [selectedTool, setSelectedTool] = useState('collection');
  const [showCamera, setShowCamera] = useState(null);
  const [userStats, setUserStats] = useState({ total_xp: 0, badges_earned: 0 });
  
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

  // QUIZ STATE
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const stats = await BadgeService.getUserStats(user.id);
        setUserStats(stats);
        
        // Load saved collection progress from backend if available
        // This would require adding collection tracking to your backend
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // TOOLS ARRAY
  const tools = [
    { id: 'collection', name: 'Kit Collection', icon: '🎴' },
    { id: 'quiz', name: 'Safety Quiz', icon: '🧠' },
    { id: 'chat', name: 'AI Chatbot', icon: '🤖' },
  ];

  // Emergency kit items (same as before)
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

  // ENHANCED QUIZ QUESTIONS based on SCDF Emergency Handbook
  const quizQuestions = [
    {
      question: "What is the first step when performing CPR?",
      options: [
        "Start chest compressions immediately",
        "Check for responsiveness by tapping shoulders and shouting", 
        "Give mouth-to-mouth ventilation",
        "Call 995"
      ],
      correct: 1,
      explanation: "Always determine responsiveness first by tapping the casualty's shoulders and shouting. This ensures the person actually needs CPR.",
      xp: 25
    },
    {
      question: "During a flash flood in Singapore, what should you do if your car stalls in rising water?",
      options: [
        "Stay in the car and wait for help",
        "Try to restart the engine",
        "Abandon the car immediately and get to higher ground",
        "Roll down windows and wait"
      ],
      correct: 2,
      explanation: "The SCDF advises 'Turn Around, Don't Drown.' If your vehicle stalls in rising water, abandon it immediately and seek higher ground. Even 60cm of water can sweep away vehicles.",
      xp: 30
    },
    {
      question: "What does the P.A.S.S. method refer to in fire safety?",
      options: [
        "Panic, Alert, Seek, Support",
        "Pull, Aim, Squeeze, Sweep",
        "Prepare, Act, Stop, Survey", 
        "Plan, Assess, Secure, Signal"
      ],
      correct: 1,
      explanation: "P.A.S.S. is the correct method for using a fire extinguisher: Pull the safety pin, Aim the nozzle at the base of the fire, Squeeze the lever, and Sweep side to side.",
      xp: 20
    },
    {
      question: "For severe bleeding with no foreign objects, what should you do after putting on protective gloves?",
      options: [
        "Apply direct pressure immediately", 
        "Elevate the injured limb above the heart, then apply direct pressure with sterile gauze",
        "Clean the wound first",
        "Apply a tourniquet"
      ],
      correct: 1,
      explanation: "According to SCDF guidelines: elevate the injured limb above the heart, place sterile gauze, apply direct pressure, then secure with bandage.",
      xp: 25
    },
    {
      question: "What should NOT be in your Ready Bag torchlight?",
      options: [
        "LED bulb",
        "Spare bulbs", 
        "Batteries fitted inside",
        "Hand strap"
      ],
      correct: 2,
      explanation: "SCDF recommends storing torchlight WITHOUT batteries fitted to prevent corrosion and battery drain. Keep extra batteries separately.",
      xp: 15
    },
    {
      question: "How deep should chest compressions be during CPR?",
      options: [
        "2-3 centimeters",
        "5 centimeters",
        "8 centimeters", 
        "10 centimeters"
      ],
      correct: 1,
      explanation: "SCDF guidelines specify compressions should be 5cm deep at a rate of 100+ per minute for effective CPR.",
      xp: 20
    },
    {
      question: "In Singapore's context, how much moving water can knock you down?",
      options: [
        "30 centimeters",
        "15 centimeters",
        "45 centimeters",
        "60 centimeters"
      ],
      correct: 1,
      explanation: "According to SCDF, just 15cm of moving water can knock you down. This is why you should never walk through moving floodwater.",
      xp: 25
    },
    {
      question: "What is the correct compression-to-ventilation ratio for CPR?",
      options: [
        "15:2",
        "30:2", 
        "20:1",
        "30:1"
      ],
      correct: 1,
      explanation: "The correct ratio is 30 chest compressions followed by 2 mouth-to-mouth ventilations, repeated until ambulance arrives.",
      xp: 20
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
      const userContext = {
        collectedItems: getCollectionStats(),
        currentScreen: 'preparedness_tools',
        location: 'Singapore',
        totalItems: [...essentialItems, ...optionalItems].length,
        essentialItems: essentialItems.length,
        userXP: userStats.total_xp
      };

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
        text: "Sorry, I'm having trouble connecting right now. Please try again later, or contact emergency services at 995 for urgent matters.",
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // QUIZ FUNCTIONS
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let correctAnswers = 0;
  
      quizQuestions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct) {
          correctAnswers++;
        }
      });
  
      const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
      
      if (user) {
        try {
          // Pass ONLY the percentage number, not an object
          const result = await BadgeService.completeModule(
            user.id, 
            'preparedness_quiz', 
            percentage  // Just a number like 25, not {score:25, xp_earned:45...}
          );
  
          const updatedStats = await BadgeService.getUserStats(user.id);
          setUserStats(updatedStats);
  
          setShowResults(true);
          setQuizCompleted(true);
  
          Alert.alert(
            "Quiz Complete! 🎉",
            `You got ${correctAnswers}/${quizQuestions.length} correct!\n\nScore: ${percentage}%\nXP Earned: ${result.xpEarned}`,
            [
              { 
                text: 'View Progress', 
                onPress: () => navigation.navigate('Badges') 
              },
              { text: "Continue", style: "default" }
            ]
          );
        } catch (moduleError) {
          console.error('Module completion error:', moduleError);
          setShowResults(true);
          setQuizCompleted(true);
  
          Alert.alert(
            "Quiz Complete! 🎉",
            `You got ${correctAnswers}/${quizQuestions.length} correct!\n\nScore: ${percentage}%`,
            [{ text: "Great!", style: "default" }]
          );
        }
      } else {
        setShowResults(true);
        setQuizCompleted(true);
  
        Alert.alert(
          "Quiz Complete! 🎉", 
          `You got ${correctAnswers}/${quizQuestions.length} correct!`,
          [{ text: "Great!", style: "default" }]
        );
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert("Error", "Failed to submit quiz. Please try again.");
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  // COLLECTION FUNCTIONS (same as before)
  const handleCollectItem = (itemId) => {
    setShowCamera(itemId);
  };

  const confirmCollection = async (itemId) => {
    setCollectedItems(prev => ({ ...prev, [itemId]: true }));
    setShowCamera(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const newStats = getCollectionStats();
        const newPercentage = Math.round(((newStats.collected + 1) / newStats.total) * 100);
        
        try {
          // Try to update module progress
          await BadgeService.updateModuleProgress(
            user.id, 
            'emergency_kit_complete', 
            newPercentage
          );
        } catch (progressError) {
          console.log('Progress update failed, trying completeModule instead');
          // If update fails, try complete module instead
          if (newPercentage >= 100) {
            await BadgeService.completeModule(user.id, 'emergency_kit_complete', 100);
          }
        }
  
        const updatedStats = await BadgeService.getUserStats(user.id);
        setUserStats(updatedStats);
  
        if (newPercentage >= 100) {
          Alert.alert(
            "🎉 Emergency Kit Complete!",
            "Amazing work! You've collected everything!\n\nYou're now fully prepared for emergencies!",
            [
              { 
                text: 'View Progress', 
                onPress: () => navigation.navigate('Badges') 
              },
              { text: "Awesome!", style: "default" }
            ]
          );
        } else {
          Alert.alert(
            "🎉 Item Collected!",
            `Great job! Kit progress: ${newPercentage}%`,
            [{ text: "Awesome!", style: "default" }]
          );
        }
      } else {
        Alert.alert(
          "🎉 Item Collected!",
          "Great job! You're one step closer to being fully prepared!",
          [{ text: "Awesome!", style: "default" }]
        );
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      Alert.alert(
        "🎉 Item Collected!",
        "Great job! You're one step closer to being fully prepared!",
        [{ text: "Awesome!", style: "default" }]
      );
    }
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

  // RENDER FUNCTIONS
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

  const renderCollection = () => {
    const stats = getCollectionStats();
    
    return (
      <View style={styles.toolContent}>
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionTitle}>🎮 Emergency Kit Collection</Text>
          <Text style={styles.collectionSubtitle}>
            Collect real emergency items to unlock your preparedness cards!
          </Text>
          
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.collected}/{stats.total}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.total_xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.percentage}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Collection Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${stats.percentage}%` }]} />
            </View>
          </View>
        </View>

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

  const renderQuiz = () => {
    if (showResults) {
      let correctAnswers = 0;
      let totalXP = 0;
      
      quizQuestions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct) {
          correctAnswers++;
          totalXP += question.xp;
        }
      });

      return (
        <View style={styles.toolContent}>
          <View style={styles.quizResults}>
            <Text style={styles.resultsTitle}>🎉 Quiz Results</Text>
            <Text style={styles.resultsScore}>{correctAnswers}/{quizQuestions.length} Correct</Text>
            <Text style={styles.resultsXP}>+{totalXP} XP Earned!</Text>
            
            <ScrollView style={styles.detailedResults}>
              {quizQuestions.map((question, index) => (
                <View key={index} style={styles.resultCard}>
                  <Text style={styles.resultQuestion}>{question.question}</Text>
                  <Text style={[
                    styles.resultAnswer,
                    selectedAnswers[index] === question.correct ? styles.correctAnswer : styles.wrongAnswer
                  ]}>
                    Your answer: {question.options[selectedAnswers[index] || 0]}
                  </Text>
                  {selectedAnswers[index] !== question.correct && (
                    <Text style={styles.correctAnswerText}>
                      Correct: {question.options[question.correct]}
                    </Text>
                  )}
                  <Text style={styles.explanation}>{question.explanation}</Text>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.submitButton} onPress={resetQuiz}>
              <Text style={styles.submitButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.toolContent}>
        <Text style={styles.toolDescription}>
          Test your emergency preparedness knowledge with SCDF-based questions:
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {quizQuestions.map((question, index) => (
            <View key={index} style={styles.quizCard}>
              <Text style={styles.questionNumber}>Question {index + 1} (+{question.xp} XP)</Text>
              <Text style={styles.questionText}>{question.question}</Text>
              
              {question.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.quizOption,
                    selectedAnswers[index] === optionIndex && styles.selectedOption
                  ]}
                  onPress={() => handleAnswerSelect(index, optionIndex)}
                >
                  <View style={[
                    styles.optionCircle,
                    selectedAnswers[index] === optionIndex && styles.selectedCircle
                  ]}>
                    <Text style={[
                      styles.optionLetter,
                      selectedAnswers[index] === optionIndex && styles.selectedLetter
                    ]}>
                      {String.fromCharCode(65 + optionIndex)}
                    </Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              Object.keys(selectedAnswers).length < quizQuestions.length && styles.submitButtonDisabled
            ]} 
            onPress={submitQuiz}
            disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
          >
            <Text style={styles.submitButtonText}>
              Submit Quiz ({Object.keys(selectedAnswers).length}/{quizQuestions.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

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
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>Preparedness Tools</Text>
            <Text style={styles.subtitle}>Build your emergency readiness</Text>
          </View>
        </SafeAreaView>
      </View>
      
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
                <Text style={styles.confirmButtonText}>✓ I Have This Item! (+10 XP)</Text>
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
  
  headerBackground: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  
  safeArea: {},
  
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

  // CHAT STYLES (same as before)
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#e6f3ff',
    borderColor: colors.primary,
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
  selectedCircle: {
    backgroundColor: colors.primary,
  },
  optionLetter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  selectedLetter: {
    color: 'white',
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
  submitButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // QUIZ RESULTS STYLES
  quizResults: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultsScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  resultsXP: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailedResults: {
    maxHeight: 400,
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#f7fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  resultAnswer: {
    fontSize: 13,
    marginBottom: 4,
  },
  correctAnswer: {
    color: '#10b981',
  },
  wrongAnswer: {
    color: '#ef4444',
  },
  correctAnswerText: {
    fontSize: 13,
    color: '#10b981',
    marginBottom: 4,
    fontWeight: '600',
  },
  explanation: {
    fontSize: 12,
    color: '#4a5568',
    fontStyle: 'italic',
    marginTop: 4,
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