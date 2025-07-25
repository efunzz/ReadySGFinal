import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export default function FlashFloodSimulator({ navigation, route }) {
  const { scenario } = route.params; // 'before', 'during', 'after'
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [avatarAnimation] = useState(new Animated.Value(0));

  // Scenario data
  const scenarios = {
    before: {
      title: "Before Flash Flood",
      subtitle: "Help James prepare for potential flooding",
      character: "👨‍💼", // James avatar
      steps: [
        {
          id: 1,
          scene: "🏠 James is at home watching TV when he hears about possible heavy rain. What should he do first?",
          choices: [
            { text: "Continue watching TV", correct: false, feedback: "❌ James should take weather warnings seriously!" },
            { text: "Check emergency supplies", correct: true, feedback: "✅ Great! Always check your emergency kit first." },
            { text: "Go outside to see the weather", correct: false, feedback: "❌ It's safer to stay indoors and prepare." }
          ]
        },
        {
          id: 2,
          scene: "📱 James opens the weather app and sees flood warnings. What's his next priority?",
          choices: [
            { text: "Pack an emergency bag", correct: true, feedback: "✅ Perfect! Emergency bag with essentials is crucial." },
            { text: "Take a shower", correct: false, feedback: "❌ Not the time for personal care - focus on safety!" },
            { text: "Call friends to chat", correct: false, feedback: "❌ Save battery for emergencies." }
          ]
        },
        {
          id: 3,
          scene: "🎒 James is packing his emergency bag. What should he include?",
          choices: [
            { text: "Laptop and gaming console", correct: false, feedback: "❌ Focus on survival items, not entertainment." },
            { text: "Water, food, flashlight, first aid", correct: true, feedback: "✅ Excellent! These are emergency essentials." },
            { text: "All his clothes", correct: false, feedback: "❌ Pack light - only essentials needed." }
          ]
        }
      ]
    },
    during: {
      title: "During Flash Flood",
      subtitle: "James is caught in a flash flood emergency!",
      character: "👨‍💼",
      steps: [
        {
          id: 1,
          scene: "🌊 Water is rising rapidly around James' building. What should he do?",
          choices: [
            { text: "Go to the highest floor", correct: true, feedback: "✅ Smart! Higher ground is always safer." },
            { text: "Try to drive through the water", correct: false, feedback: "❌ NEVER drive through flood water - it's deadly!" },
            { text: "Wait in the basement", correct: false, feedback: "❌ Basements flood first - get to higher ground!" }
          ]
        },
        {
          id: 2,
          scene: "📞 James is on the 5th floor. Should he call for help?",
          choices: [
            { text: "Call 995 (Emergency)", correct: true, feedback: "✅ Perfect! 995 is Singapore's emergency number." },
            { text: "Post on social media", correct: false, feedback: "❌ Social media won't save you - call 995!" },
            { text: "Wait for someone to find him", correct: false, feedback: "❌ Don't wait - actively seek help!" }
          ]
        },
        {
          id: 3,
          scene: "🚁 Rescue services arrive. What should James do?",
          choices: [
            { text: "Follow rescuer instructions exactly", correct: true, feedback: "✅ Always listen to trained rescuers!" },
            { text: "Argue about the rescue method", correct: false, feedback: "❌ Trust the professionals - they know best!" },
            { text: "Go back for more belongings", correct: false, feedback: "❌ Life is more important than belongings!" }
          ]
        }
      ]
    },
    after: {
      title: "After Flash Flood",
      subtitle: "The flood has passed. Help James recover safely",
      character: "👨‍💼",
      steps: [
        {
          id: 1,
          scene: "🏠 James wants to return home. What should he check first?",
          choices: [
            { text: "If his car is okay", correct: false, feedback: "❌ Check building safety first!" },
            { text: "Structural damage to the building", correct: true, feedback: "✅ Safety first - check for damage before entering." },
            { text: "If his phone is working", correct: false, feedback: "❌ Building safety is the priority!" }
          ]
        },
        {
          id: 2,
          scene: "💧 There's standing water in James' home. What should he do?",
          choices: [
            { text: "Wade through it immediately", correct: false, feedback: "❌ Standing water may be contaminated or hide dangers!" },
            { text: "Turn off electricity first", correct: true, feedback: "✅ Excellent! Water + electricity = danger!" },
            { text: "Ignore it and clean later", correct: false, feedback: "❌ Address water damage quickly to prevent mold." }
          ]
        },
        {
          id: 3,
          scene: "🧹 James is cleaning up. What's most important?",
          choices: [
            { text: "Throw away all food that touched flood water", correct: true, feedback: "✅ Perfect! Flood water contaminates food." },
            { text: "Save everything to avoid waste", correct: false, feedback: "❌ Contaminated items can make you sick!" },
            { text: "Clean everything with regular soap", correct: false, feedback: "❌ Use disinfectant for flood contamination." }
          ]
        }
      ]
    }
  };

  const currentScenario = scenarios[scenario];
  const currentStepData = currentScenario.steps[currentStep];

  // Animate avatar
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(avatarAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(avatarAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const handleChoice = (choice) => {
    setIsCorrect(choice.correct);
    setFeedbackText(choice.feedback);
    setShowFeedback(true);

    if (choice.correct) {
      setScore(prev => prev + 10);
    } else {
      setLives(prev => prev - 1);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
      if (currentStep < currentScenario.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        showFinalResults();
      }
    }, 2000);
  };

  const showFinalResults = () => {
    const totalSteps = currentScenario.steps.length;
    const percentage = Math.round((score / (totalSteps * 10)) * 100);
    
    let resultMessage = '';
    if (percentage >= 80) {
      resultMessage = '🏆 Excellent! You\'re well-prepared for emergencies!';
    } else if (percentage >= 60) {
      resultMessage = '👍 Good job! Review the areas you missed.';
    } else {
      resultMessage = '📚 Keep learning! Practice makes perfect.';
    }

    Alert.alert(
      'Mission Complete!',
      `${resultMessage}\n\nScore: ${score}/${totalSteps * 10}\nAccuracy: ${percentage}%`,
      [
        { text: 'Try Again', onPress: () => restartSimulator() },
        { text: 'Back to Menu', onPress: () => navigation.goBack() }
      ]
    );
  };

  const restartSimulator = () => {
    setCurrentStep(0);
    setScore(0);
    setLives(3);
    setShowFeedback(false);
  };

  const avatarTransform = avatarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{currentScenario.title}</Text>
          <Text style={styles.subtitle}>{currentScenario.subtitle}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / currentScenario.steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} / {currentScenario.steps.length}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Lives</Text>
          <Text style={styles.statValue}>{'❤️'.repeat(lives)}</Text>
        </View>
      </View>

      {/* Scenario Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showFeedback ? (
          <>
            <View style={styles.sceneContainer}>
              <Text style={styles.sceneText}>{currentStepData.scene}</Text>
            </View>

            <View style={styles.choicesContainer}>
              {currentStepData.choices.map((choice, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.choiceButton}
                  onPress={() => handleChoice(choice)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceText}>{choice.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.feedbackContainer}>
            <View style={[
              styles.feedbackCard,
              { backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2' }
            ]}>
              <Text style={[
                styles.feedbackText,
                { color: isCorrect ? '#065f46' : '#991b1b' }
              ]}>
                {feedbackText}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Avatar - Pokemon style */}
      <Animated.View style={[
        styles.avatarContainer,
        { transform: [{ translateY: avatarTransform }] }
      ]}>
        <View style={styles.avatarBubble}>
          <Text style={styles.avatarText}>James</Text>
        </View>
        <Text style={styles.avatar}>{currentScenario.character}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.light,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sceneContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sceneText: {
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 26,
    textAlign: 'center',
  },
  choicesContainer: {
    marginBottom: 100, // Space for avatar
  },
  choiceButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  choiceText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  feedbackCard: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  avatarBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
  avatar: {
    fontSize: 40,
    textAlign: 'center',
  },
});