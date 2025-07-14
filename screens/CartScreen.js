import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

//Import colors
import { colors } from '../constants/theme';

export default function CartScreen({ navigation }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedTool, setSelectedTool] = useState('checklist');

  const tools = [
    { id: 'checklist', name: 'Emergency Kit', icon: '✅' },
    { id: 'quiz', name: 'Safety Quiz', icon: '🧠' },
    { id: 'progress', name: 'My Progress', icon: '📊' },
  ];

  const emergencyKitItems = [
    { category: 'Water & Food', items: [
      'Water (1 gallon per person per day for 3 days)',
      'Non-perishable food (3-day supply)',
      'Manual can opener',
      'Paper plates, cups, plastic utensils'
    ]},
    { category: 'First Aid & Medicine', items: [
      'First aid kit',
      'Prescription medications',
      'Over-the-counter medications',
      'Thermometer'
    ]},
    { category: 'Tools & Supplies', items: [
      'Flashlight and extra batteries',
      'Battery-powered radio',
      'Cell phone chargers',
      'Multi-purpose tool/Swiss Army knife'
    ]},
    { category: 'Personal Items', items: [
      'Important documents (copies)',
      'Cash in small bills',
      'Emergency contact information',
      'Change of clothing and sturdy shoes'
    ]},
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

  const toggleChecklistItem = (category, itemIndex) => {
    const key = `${category}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgressPercentage = () => {
    const totalItems = emergencyKitItems.reduce((sum, category) => sum + category.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const renderChecklist = () => (
    <ScrollView style={styles.toolContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.toolDescription}>
        Build your emergency kit by checking off items as you collect them:
      </Text>
      
      {emergencyKitItems.map((category, categoryIndex) => (
        <View key={categoryIndex} style={styles.checklistCategory}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.items.map((item, itemIndex) => {
            const key = `${category.category}-${itemIndex}`;
            const isChecked = checkedItems[key];
            
            return (
              <TouchableOpacity
                key={itemIndex}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem(category.category, itemIndex)}
              >
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.checklistText, isChecked && styles.checkedText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );

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

  const renderProgress = () => (
    <ScrollView style={styles.toolContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.toolDescription}>
        Track your emergency preparedness journey:
      </Text>
      
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Emergency Kit Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${getProgressPercentage()}%` }]} />
        </View>
        <Text style={styles.progressText}>{getProgressPercentage()}% Complete</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Missions Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>85</Text>
          <Text style={styles.statLabel}>Quiz Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
      </View>
      
      <View style={styles.achievementSection}>
        <Text style={styles.achievementTitle}>Recent Achievements</Text>
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <View>
            <Text style={styles.achievementName}>First Aid Expert</Text>
            <Text style={styles.achievementDesc}>Completed medical emergency mission</Text>
          </View>
        </View>
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>🎯</Text>
          <View>
            <Text style={styles.achievementName}>Quick Learner</Text>
            <Text style={styles.achievementDesc}>Scored 80%+ on safety quiz</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (selectedTool) {
      case 'checklist': return renderChecklist();
      case 'quiz': return renderQuiz();
      case 'progress': return renderProgress();
      default: return renderChecklist();
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
  checklistCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    color: '#4a5568',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#a0aec0',
  },
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
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  achievementSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#718096',
  },
});