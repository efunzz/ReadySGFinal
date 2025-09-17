// screens/BadgeTestScreen.js - Now with comprehensive badge tests
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

const BadgeTestScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(['Test screen loaded! 🎉']);
  const [loading, setLoading] = useState(false);

  const addMessage = (message) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearMessages = () => {
    setMessages(['Messages cleared']);
  };

  const testBasicFunction = () => {
    addMessage('✅ Button works!');
    Alert.alert('Success', 'Basic function is working');
  };

  const testSupabaseConnection = async () => {
    try {
      addMessage('🔄 Testing Supabase connection...');
      
      const { supabase } = await import('../../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        addMessage(`✅ Supabase connected! User: ${user.email}`);
        return user;
      } else {
        addMessage('❌ No user found');
        return null;
      }
    } catch (error) {
      addMessage(`❌ Supabase error: ${error.message}`);
      return null;
    }
  };

  const testTableAccess = async () => {
    try {
      addMessage('🔄 Testing all tables...');
      
      const { supabase } = await import('../../lib/supabase');
      
      // Test badges table
      const { data: badges, error: badgeError } = await supabase
        .from('badges')
        .select('*')
        .limit(3);
        
      if (badgeError) {
        addMessage(`❌ Badges table: ${badgeError.message}`);
        return false;
      } else {
        addMessage(`✅ Badges table: Found ${badges.length} badges`);
      }

      // Test learning_modules table
      const { data: modules, error: moduleError } = await supabase
        .from('learning_modules')
        .select('*')
        .limit(3);
        
      if (moduleError) {
        addMessage(`❌ Learning modules: ${moduleError.message}`);
      } else {
        addMessage(`✅ Learning modules: Found ${modules.length} modules`);
      }

      return true;
    } catch (error) {
      addMessage(`❌ Table test failed: ${error.message}`);
      return false;
    }
  };

  const initializeUserBadges = async () => {
    try {
      addMessage('🔄 Initializing user badges...');
      
      const { supabase } = await import('../../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addMessage('❌ No user found for initialization');
        return;
      }
  
      addMessage(`🔄 User ID: ${user.id}`);
  
      // Step 1: Check if user_stats exists, create if not
      addMessage('🔄 Checking user stats...');
      const { data: existingStats, error: statsCheckError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id);
  
      if (statsCheckError) {
        addMessage(`❌ Error checking stats: ${statsCheckError.message}`);
      }
  
      if (!existingStats || existingStats.length === 0) {
        // Create user stats
        const { data: newStats, error: statsError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_xp: 0,
            badges_earned: 0,
            courses_completed: 0,
            level: 1
          })
          .select();
  
        if (statsError) {
          addMessage(`❌ Failed to create user stats: ${statsError.message}`);
          addMessage(`   Details: ${JSON.stringify(statsError)}`);
        } else {
          addMessage('✅ Created user stats record!');
        }
      } else {
        addMessage('✅ User stats already exist');
      }
  
      // Step 2: Check existing badges
      const { data: existingBadges, error: badgeCheckError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id);
  
      if (badgeCheckError) {
        addMessage(`❌ Error checking badges: ${badgeCheckError.message}`);
        return;
      }
  
      if (existingBadges && existingBadges.length > 0) {
        addMessage(`✅ User already has ${existingBadges.length} badges initialized`);
        return;
      }
  
      // Step 3: Get all available badges
      const { data: allBadges, error: badgeError } = await supabase
        .from('badges')
        .select('id, badge_key, title')
        .eq('is_active', true);
  
      if (badgeError || !allBadges || allBadges.length === 0) {
        addMessage(`❌ No badges found: ${badgeError?.message || 'No data'}`);
        return;
      }
  
      addMessage(`🔄 Found ${allBadges.length} badges to initialize...`);
  
      // Step 4: Create user badge records ONE BY ONE (to avoid batch issues)
      let successCount = 0;
      let errorCount = 0;
  
      for (const badge of allBadges) {
        try {
          const { error: insertError } = await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id,
              status: badge.badge_key === 'lifesaver' ? 'locked' : 'available',
              progress: 0
            });
  
          if (insertError) {
            addMessage(`❌ Failed to create badge "${badge.title}": ${insertError.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          addMessage(`❌ Exception creating badge "${badge.title}": ${error.message}`);
          errorCount++;
        }
      }
  
      addMessage(`✅ Created ${successCount} badge records (${errorCount} errors)`);
  
    } catch (error) {
      addMessage(`❌ Initialization failed: ${error.message}`);
    }
  };
  

  const testBadgeService = async () => {
    try {
      addMessage('🔄 Testing BadgeService functions...');
      
      const { supabase } = await import('../../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addMessage('❌ No user for BadgeService test');
        return;
      }

      // Test getUserStats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError) {
        addMessage(`❌ User stats error: ${statsError.message}`);
      } else {
        addMessage(`✅ User stats: XP=${stats.total_xp}, Badges=${stats.badges_earned}`);
      }

      // Test getUserBadges with fixed query
      const { data: userBadges, error: badgeError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (
            badge_key,
            title,
            description,
            icon,
            color,
            category,
            level,
            xp_reward
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(5);

      if (badgeError) {
        addMessage(`❌ User badges error: ${badgeError.message}`);
      } else {
        addMessage(`✅ User badges query: Found ${userBadges?.length || 0} badges`);
        if (userBadges && userBadges.length > 0) {
          const firstBadge = userBadges[0];
          addMessage(`   - Example: "${firstBadge.badges.title}" (${firstBadge.status})`);
        }
      }

    } catch (error) {
      addMessage(`❌ BadgeService test failed: ${error.message}`);
    }
  };
  
const debugBadgeQuery = async () => {
    try {
      addMessage('🔍 Debug: Testing badge query...');
      
      const { supabase } = await import('../../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addMessage('❌ No user for debug test');
        return;
      }
  
      const badgeKey = 'cardiac_arrest_responder';
      addMessage(`🔄 Looking for badge: ${badgeKey}`);
  
      // Step 1: Check if the badge exists in badges table
      const { data: badgeCheck, error: badgeCheckError } = await supabase
        .from('badges')
        .select('id, badge_key, title')
        .eq('badge_key', badgeKey)
        .single();
  
      if (badgeCheckError) {
        addMessage(`❌ Badge check error: ${badgeCheckError.message}`);
        return;
      }
  
      addMessage(`✅ Found badge in badges table: "${badgeCheck.title}"`);
  
      // Step 2: Check if user has this badge
      const { data: userBadgeCheck, error: userBadgeError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .eq('badge_id', badgeCheck.id)
        .single();
  
      if (userBadgeError) {
        addMessage(`❌ User badge check error: ${userBadgeError.message}`);
        return;
      }
  
      addMessage(`✅ User badge found: status=${userBadgeCheck.status}, progress=${userBadgeCheck.progress}`);
  
      // Step 3: Try the problematic query
      const { data: problemQuery, error: problemError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (
            badge_key,
            title,
            description,
            icon,
            color,
            category,
            level,
            xp_reward,
            requirements,
            max_progress
          )
        `)
        .eq('user_id', user.id)
        .eq('badges.badge_key', badgeKey);  // This line might be the problem
  
      if (problemError) {
        addMessage(`❌ Problem query error: ${problemError.message}`);
      } else {
        addMessage(`✅ Problem query returned ${problemQuery?.length || 0} rows`);
      }
  
      // Step 4: Try a simpler approach
      const { data: simpleQuery, error: simpleError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (
            badge_key,
            title,
            description,
            icon,
            color,
            category,
            level,
            xp_reward,
            requirements,
            max_progress
          )
        `)
        .eq('user_id', user.id)
        .eq('badge_id', badgeCheck.id)
        .single();
  
      if (simpleError) {
        addMessage(`❌ Simple query error: ${simpleError.message}`);
      } else {
        addMessage(`✅ Simple query works! Badge: "${simpleQuery.badges.title}"`);
      }
  
    } catch (error) {
      addMessage(`❌ Debug failed: ${error.message}`);
    }
  };
  

  const testCompleteModule = async () => {
    try {
      addMessage('🔄 Testing module completion...');
      
      const { supabase } = await import('../../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addMessage('❌ No user for module test');
        return;
      }
  
      // Find flash flood simulator module
      const { data: module, error: moduleError } = await supabase
        .from('learning_modules')
        .select('id, module_key, title, xp_reward')
        .eq('module_key', 'flash_flood_simulator')
        .single();
  
      if (moduleError) {
        addMessage(`❌ Flash flood module not found: ${moduleError.message}`);
        return;
      }
  
      addMessage(`✅ Found module: ${module.title} (${module.xp_reward} XP)`);
  
      // Check if already completed
      const { data: existingProgress } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', module.id)
        .single();
  
      if (existingProgress) {
        addMessage('✅ Module already completed - updating score');
      }
  
      // Use UPSERT to handle duplicates
      const { data: progress, error: progressError } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: user.id,
          module_id: module.id,
          status: 'completed',
          progress_percentage: 100,
          score: Math.floor(Math.random() * 20) + 80, // Random score 80-100
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,module_id' // Handle duplicates
        })
        .select();
  
      if (progressError) {
        addMessage(`❌ Module completion error: ${progressError.message}`);
      } else {
        addMessage('✅ Module completion recorded!');
        
        // Check updated stats after a delay
        setTimeout(async () => {
          const { data: newStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (newStats) {
            addMessage(`🎉 Updated stats: XP=${newStats.total_xp}, Courses=${newStats.courses_completed}, Badges=${newStats.badges_earned}`);
          }
        }, 3000);
      }
  
    } catch (error) {
      addMessage(`❌ Module completion failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    clearMessages();
    
    addMessage('🚀 Starting comprehensive badge system tests...');
    
    const user = await testSupabaseConnection();
    if (!user) {
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tablesOk = await testTableAccess();
    if (!tablesOk) {
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    await initializeUserBadges();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testBadgeService();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testCompleteModule();
    
    setLoading(false);
    addMessage('🎉 All tests completed!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Comprehensive Badge Test</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]} 
          onPress={runAllTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '🔄 Running All Tests...' : '🚀 Run All Badge Tests'}
          </Text>
        </TouchableOpacity>

        <View style={styles.individualTests}>
          <TouchableOpacity style={styles.button} onPress={testSupabaseConnection}>
            <Text style={styles.buttonTextSecondary}>1. Test Connection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testTableAccess}>
            <Text style={styles.buttonTextSecondary}>2. Test Tables</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={initializeUserBadges}>
            <Text style={styles.buttonTextSecondary}>3. Initialize User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testBadgeService}>
            <Text style={styles.buttonTextSecondary}>4. Test Badge Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testCompleteModule}>
            <Text style={styles.buttonTextSecondary}>5. Complete Module</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={debugBadgeQuery}>
            <Text style={styles.buttonTextSecondary}>🔍 Debug Badge Query</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearMessages}>
            <Text style={styles.buttonText}>🗑️ Clear Messages</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer}>
        <Text style={styles.messagesTitle}>📋 Test Results:</Text>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d3748',
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    padding: 16,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    borderColor: '#9ca3af',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '600',
  },
  individualTests: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  message: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default BadgeTestScreen;