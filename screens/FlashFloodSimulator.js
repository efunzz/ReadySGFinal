import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ImageBackground, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

//imports for linking to badges backend
import { BadgeService } from '../services/badgeService';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function FlashFloodSimulator({ navigation, route }) {
  const { scenario } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); 
  const [lives, setLives] = useState(3);
  const [gamePhase, setGamePhase] = useState('scene'); 
  const [feedbackText, setFeedbackText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // Sound effects
  const [sounds, setSounds] = useState({
    buttonPress: null,
    correct: null,
    incorrect: null,
    transition: null
  });

  const scenarios = {
    before: {
      title: "Before Flash Flood",
      subtitle: "Help James prepare following SCDF protocols",
      character: "👨‍💼",
      steps: [
        {
          id: 1,
          scene: "James is watching TV in his Toa Payoh HDB flat when the weather alert sounds: 'FLASH FLOOD WARNING - HEAVY RAIN EXPECTED.'",
          image: require('../assets/scene1.png'),
          question: "What should James do first?",
          choices: [
            { text: "Continue watching TV", correct: false, feedback: "Weather warnings save lives! Always take them seriously." },
            { text: "Grab his Ready Bag and check supplies", correct: true, feedback: "Smart! SCDF recommends always having your Ready Bag accessible." },
            { text: "Go outside to see the weather", correct: false, feedback: "Stay indoors during severe weather - check supplies first!" }
          ]
        },
        {
          id: 2,
          scene: "James opens his Ready Bag. Heavy rain is intensifying outside his window.",
          image: require('../assets/scene2.png'),
          question: "Which SCDF-recommended items should he prioritize checking?",
          choices: [
            { text: "Laptop, chargers, entertainment", correct: false, feedback: "Focus on survival essentials first - electronics can wait!" },
            { text: "Flashlight, battery radio, first aid kit", correct: true, feedback: "Perfect! These are SCDF's top priority emergency items." },
            { text: "Important documents only", correct: false, feedback: "Documents matter, but survival tools come first!" }
          ]
        },
        {
          id: 3,
          scene: "The void deck is flooding! Water is 30cm deep around James' HDB block. SCDF announces: 'Residents prepare for possible evacuation.'",
          image: require('../assets/scene3.png'),
          question: "What should James do?",
          choices: [
            { text: "Wait for official evacuation order", correct: true, feedback: "Correct! SCDF says evacuate only when authorities advise." },
            { text: "Run outside through flood water", correct: false, feedback: "Dangerous! 15cm of moving water can knock you down." },
            { text: "Go to basement car park", correct: false, feedback: "Never go to lower levels during flooding!" }
          ]
        }
      ]
    },
    during: {
      title: "During Flash Flood",
      subtitle: "James faces emergency flood situation", 
      character: "👨‍💼",
      steps: [
        {
          id: 1,
          scene: "From his window, James sees neighbor Uncle Tan trying to drive through flooded road. Water is above the car wheels.",
          image: require('../assets/scene4.png'),
          question: "What should James do?",
          choices: [
            { text: "Shout for Uncle Tan to abandon car", correct: true, feedback: "Right! SCDF protocol: abandon vehicle if it stalls in rising water." },
            { text: "Tell him to drive faster", correct: false, feedback: "Never drive through flood water - it can sweep away vehicles!" },
            { text: "Do nothing", correct: false, feedback: "Help others follow safety protocols - lives are at stake!" }
          ]
        },
        {
          id: 2,
          scene: "SCDF announces evacuation order. James sees elderly Mrs. Lim next door hasn't heard the announcement.",
          image: require('../assets/scene5.png'),
          question: "What should James do?",
          choices: [
            { text: "Call 995 to report assistance needed", correct: true, feedback: "Right! 995 connects you to SCDF for emergency assistance." },
            { text: "Post about it on social media", correct: false, feedback: "Social media won't bring immediate help - call 995!" },
            { text: "Go knock on her door himself", correct: false, feedback: "Let trained rescuers handle evacuation - your safety matters too!" }
          ]
        },
        {
          id: 3,
          scene: "James and Mrs. Lim reach ground floor where water is 20cm deep. There's a faster route through deeper flood or longer route on higher ground.",
          image: require('../assets/scene6.png'),
          question: "Which route should they take?",
          choices: [
            { text: "Take longer route on higher ground", correct: true, feedback: "Smart choice! SCDF advises moving to higher ground away from flood water." },
            { text: "Wade through shorter flooded route", correct: false, feedback: "Dangerous! Even shallow moving water can knock you down." },
            { text: "Wait for water to recede", correct: false, feedback: "Don't wait - evacuate immediately when authorities order it!" }
          ]
        }
      ]
    },
    after: {
      title: "After Flash Flood",
      subtitle: "Safe recovery following SCDF procedures",
      character: "👨‍💼",
      steps: [
        {
          id: 1,
          scene: "At Toa Payoh Community Centre, SCDF officers are registering evacuees. James has his NRIC and Ready Bag.",
          image: require('../assets/scene7.png'),
          question: "What should James do first?",
          choices: [
            { text: "Register with SCDF officers", correct: true, feedback: "Perfect! Always follow official procedures during emergencies." },
            { text: "Find comfortable spot and wait", correct: false, feedback: "Register first so authorities can track everyone's safety." },
            { text: "Leave to check on his flat", correct: false, feedback: "Never leave evacuation center without permission!" }
          ]
        },
        {
          id: 2,
          scene: "Next day, authorities say it's safe to return. James sees his flat has 10cm of standing water inside.",
          image: require('../assets/scene8.png'),
          question: "What's his first action?",
          choices: [
            { text: "Turn off electricity at main switch", correct: true, feedback: "Critical safety step! Water and electricity are deadly together." },
            { text: "Wade in to save belongings", correct: false, feedback: "Safety first! Always secure electricity before entering flooded areas." },
            { text: "Wait for water to dry naturally", correct: false, feedback: "Address flooding quickly, but safely - turn off power first!" }
          ]
        },
        {
          id: 3,
          scene: "James is cleaning up after securing electricity. He finds food items that touched flood water.",
          image: require('../assets/scene9.png'),
          question: "What should James do?",
          choices: [
            { text: "Throw away all contaminated food", correct: true, feedback: "Perfect! Flood water contaminates food - SCDF safety protocol." },
            { text: "Save everything to avoid waste", correct: false, feedback: "Contaminated items can make you sick!" },
            { text: "Clean with regular soap only", correct: false, feedback: "Use disinfectant for flood contamination cleanup." }
          ]
        }
      ]
    }
  };

  const currentScenario = scenarios[scenario];
  const currentStepData = currentScenario?.steps[currentStep];

  // Safety check - if data not loaded properly, show loading or go back
  if (!currentScenario || !currentStepData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 18 }}>Loading scenario...</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    // Start each scene with the scene phase
    setGamePhase('scene');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Play transition sound and light haptic
    playSound('transition');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [currentStep]);

  useEffect(() => {
    loadSounds();
    return () => {
      // Cleanup sounds when component unmounts
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.unloadAsync();
        }
      });
    };
  }, []);
  
  const loadSounds = async () => {
    try {
      const buttonPressSound = await Audio.Sound.createAsync(
        require('../assets/sounds/button-press.mp3')
      );
      const correctSound = await Audio.Sound.createAsync(
        require('../assets/sounds/correct.mp3')
      );
      const incorrectSound = await Audio.Sound.createAsync(
        require('../assets/sounds/incorrect.mp3')
      );
      const transitionSound = await Audio.Sound.createAsync(
        require('../assets/sounds/transition.mp3')
      );

      setSounds({
        buttonPress: buttonPressSound.sound,
        correct: correctSound.sound,
        incorrect: incorrectSound.sound,
        transition: transitionSound.sound
      });
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };

  const playSound = async (soundType) => {
    try {
      const sound = sounds[soundType];
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleNext = () => {
    // Button press feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSound('buttonPress');
    setGamePhase('question');
  };

  const handleChoice = (choice) => {
    console.log('handleChoice called, current step:', currentStep, 'choice correct:', choice.correct);
    
    // Choice selection feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSound('buttonPress');
    
    setIsCorrect(choice.correct);
    setFeedbackText(choice.feedback);
    setGamePhase('feedback');

    if (choice.correct) {
      setScore(prev => prev + 10);
      setCorrectAnswers(prev => {
        const newCount = prev + 1;
        console.log('Correct answers now:', newCount);
        return newCount;
      });
      // Success haptic and sound
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSound('correct');
      }, 200);
    } else {
      setLives(prev => prev - 1);
      // Error haptic and sound
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        playSound('incorrect');
      }, 200);
    }
  };

  const handleContinueAfterFeedback = () => {
    if (currentStep < currentScenario.steps.length - 1) {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        console.log('Moving to step:', nextStep);
        return nextStep;
      });
    } else {
      showFinalResults();
    }
  };

  const showFinalResults = async () => {
    const totalSteps = currentScenario.steps.length;
    console.log('Final Results - Total steps:', totalSteps, 'Correct answers:', correctAnswers, 'Score:', score);
    
    const percentage = Math.round((correctAnswers / totalSteps) * 100);
    
    let resultMessage = '';
    if (percentage >= 80) {
      resultMessage = '🏆 Excellent! You\'re well-prepared for emergencies!';
    } else if (percentage >= 60) {
      resultMessage = '👍 Good job! Review the areas you missed.';
    } else {
      resultMessage = '📚 Keep learning! Practice makes perfect.';
    }
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Map scenario to module key
        const moduleKeys = {
          'before': 'flash_flood_before',
          'during': 'flash_flood_during', 
          'after': 'flash_flood_after'
        };
        
        const moduleKey = moduleKeys[scenario];
        if (moduleKey) {
          console.log('🎯 Completing module:', moduleKey, 'with score:', percentage);
          await BadgeService.completeModule(user.id, moduleKey, percentage);
          console.log('✅ Module completed successfully!');
        }
      }
    } catch (error) {
      console.error('❌ Error updating progress:', error);
      // Don't show error to user - just log it
    }
  
    Alert.alert(
      'Mission Complete!',
      `${resultMessage}\n\nCorrect Answers: ${correctAnswers}/${totalSteps}\nAccuracy: ${percentage}%\nTotal Points: ${score}`,
      [
        { text: 'Try Again', onPress: () => restartSimulator() },
        { text: 'Back to Menu', onPress: () => navigation.goBack() }
      ]
    );
  };

  const restartSimulator = () => {
    setCurrentStep(0);
    setScore(0);
    setCorrectAnswers(0);
    setLives(3);
    setGamePhase('scene');
  };

  const renderGameContent = () => {
    if (gamePhase === 'scene') {
      return (
        <View style={styles.sceneInterface}>
          <View style={styles.sceneTextBox}>
            <Text style={styles.sceneText}>{currentStepData.scene}</Text>
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Text style={styles.nextButtonSubtext}>Tap to proceed</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (gamePhase === 'question') {
      return (
        <View style={styles.questionInterface}>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>{currentStepData.question}</Text>
          </View>
          <View style={styles.choicesContainer}>
            {currentStepData.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.choiceButton}
                onPress={() => handleChoice(choice)}
                activeOpacity={0.8}
              >
                <Text style={styles.choiceLabel}>{String.fromCharCode(65 + index)}</Text>
                <Text style={styles.choiceText}>{choice.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    
    if (gamePhase === 'feedback') {
      return (
        <View style={styles.feedbackInterface}>
          <View style={[
            styles.feedbackBox,
            { backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2', borderColor: isCorrect ? '#10b981' : '#ef4444' }
          ]}>
            <Text style={styles.feedbackIcon}>{isCorrect ? '✅' : '❌'}</Text>
            <Text style={[
              styles.feedbackMessage,
              { color: isCorrect ? '#065f46' : '#991b1b' }
            ]}>
              {feedbackText}
            </Text>
            <Text style={styles.scoreUpdate}>
              {isCorrect ? '+10 points' : 'No points'}
            </Text>
          </View>
          
          {/* Manual continue button */}
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueAfterFeedback}
          >
            <Text style={styles.continueButtonText}>
              {currentStep < currentScenario.steps.length - 1 ? 'Continue →' : 'See Results →'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderTestButton = () => {
    // Only show in development/testing
    if (__DEV__) {
      return (
        <TouchableOpacity 
          style={styles.testBadgeButton}
          onPress={async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const result = await BadgeService.completeModule(
                  user.id, 
                  'flash_flood_simulator', 
                  95
                );
                Alert.alert(
                  'Badge Test Complete!',
                  `Earned ${result.xpEarned} XP. Check badges tab!`,
                  [
                    { text: 'View Badges', onPress: () => navigation.navigate('Badges') },
                    { text: 'OK', style: 'cancel' }
                  ]
                );
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }}
        >
          <Text style={styles.testBadgeButtonText}>🧪 Test Badge Earn</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  // Calculate progress percentage for progress bar
  const progressPercentage = ((currentStep + 1) / currentScenario.steps.length) * 100;

  return (
    <View style={styles.container}>
      {/* Full-screen pixel art background */}
      <ImageBackground 
        source={currentStepData.image} 
        style={styles.fullScreenImage}
        resizeMode="cover"
      >
        {/* Top UI overlay */}
        <View style={styles.topUI}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.gameStats}>
            <View style={styles.livesContainer}>
              <Text style={styles.livesText}>{'❤️'.repeat(lives)}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          </View>
        </View>

        {/* Progress indicator with progress bar */}
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {currentStep + 1} / {currentScenario.steps.length}
          </Text>
          <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
          
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* Game content overlay */}
        {renderGameContent()}
        {renderTestButton()}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenImage: {
    flex: 1,
    width: width,
    height: height,
  },
  topUI: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameStats: {
    flexDirection: 'row',
    gap: 12,
  },
  livesContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  livesText: {
    fontSize: 16,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,107,107,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 5,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  scenarioTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(255,107,107,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  
  // Scene Phase Styles
  sceneInterface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  sceneTextBox: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    maxWidth: '90%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sceneText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: 'rgba(255,107,107,0.9)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },

  // Question Phase Styles  
  questionInterface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    alignItems: 'center',
    maxWidth: '90%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  questionText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  choicesContainer: {
    width: '100%',
    gap: 15,
  },
  choiceButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,107,107,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  choiceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 15,
    width: 35,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
  },
  choiceText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },

  // Feedback Phase Styles
  feedbackInterface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  feedbackBox: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    minWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 30,
  },
  feedbackIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  feedbackMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  scoreUpdate: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  continueButton: {
    backgroundColor: 'rgba(255,107,107,0.9)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testBadgeButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'rgba(128, 0, 128, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  testBadgeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});