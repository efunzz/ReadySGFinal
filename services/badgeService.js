import { supabase } from '../lib/supabase'; // Use your existing supabase import path

export const BadgeService = {
  // Get all badges with user progress
  async getUserBadges(userId) {
    try {
      const { data, error } = await supabase
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
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our frontend structure
      return data.map(userBadge => ({
        id: userBadge.badges.badge_key,
        title: userBadge.badges.title,
        description: userBadge.badges.description,
        icon: userBadge.badges.icon,
        color: userBadge.badges.color,
        category: userBadge.badges.category,
        level: userBadge.badges.level,
        xpReward: userBadge.badges.xp_reward,
        requirements: userBadge.badges.requirements,
        maxProgress: userBadge.badges.max_progress,
        progress: userBadge.progress,
        status: userBadge.status,
        completedAt: userBadge.completed_at,
      }));
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  },

  // Get badges by category
  async getBadgesByCategory(userId, category) {
    try {
      let query = supabase
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
        .eq('user_id', userId);

      if (category !== 'all') {
        query = query.eq('badges.category', category);
      }

      const { data, error } = await query.order('badges.level', { ascending: true });

      if (error) throw error;
      
      return data.map(userBadge => ({
        id: userBadge.badges.badge_key,
        title: userBadge.badges.title,
        description: userBadge.badges.description,
        icon: userBadge.badges.icon,
        color: userBadge.badges.color,
        category: userBadge.badges.category,
        level: userBadge.badges.level,
        xpReward: userBadge.badges.xp_reward,
        requirements: userBadge.badges.requirements,
        maxProgress: userBadge.badges.max_progress,
        progress: userBadge.progress,
        status: userBadge.status,
        completedAt: userBadge.completed_at,
      }));
    } catch (error) {
      console.error('Error fetching badges by category:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Complete a learning module (this will trigger badge progress updates)
  async completeModule(userId, moduleKey, score = null) {
    try {
      // First, get the module ID
      const { data: moduleData, error: moduleError } = await supabase
        .from('learning_modules')
        .select('id, xp_reward')
        .eq('module_key', moduleKey)
        .single();

      if (moduleError) throw moduleError;

      // Insert or update user learning progress
      const { data, error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: userId,
          module_id: moduleData.id,
          status: 'completed',
          progress_percentage: 100,
          score: score,
          completed_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;

      return {
        success: true,
        xpEarned: moduleData.xp_reward,
        data: data[0],
      };
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  },

  // Update module progress (for ongoing learning)
  async updateModuleProgress(userId, moduleKey, progressPercentage) {
    try {
      // Get the module ID
      const { data: moduleData, error: moduleError } = await supabase
        .from('learning_modules')
        .select('id')
        .eq('module_key', moduleKey)
        .single();

      if (moduleError) throw moduleError;

      // Insert or update user learning progress
      const { data, error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: userId,
          module_id: moduleData.id,
          status: progressPercentage >= 100 ? 'completed' : 'in_progress',
          progress_percentage: progressPercentage,
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating module progress:', error);
      throw error;
    }
  },

  // Get learning modules with user progress
  async getUserLearningModules(userId) {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select(`
          *,
          user_learning_progress!left (
            status,
            progress_percentage,
            score,
            completed_at
          )
        `)
        .eq('user_learning_progress.user_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user learning modules:', error);
      throw error;
    }
  },

  // Get specific badge details with requirements breakdown
  async getBadgeDetails(userId, badgeKey) {
    try {
      const { data, error } = await supabase
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
        .eq('user_id', userId)
        .eq('badges.badge_key', badgeKey)
        .single();

      if (error) throw error;

      const badge = {
        id: data.badges.badge_key,
        title: data.badges.title,
        description: data.badges.description,
        icon: data.badges.icon,
        color: data.badges.color,
        category: data.badges.category,
        level: data.badges.level,
        xpReward: data.badges.xp_reward,
        requirements: data.badges.requirements,
        maxProgress: data.badges.max_progress,
        progress: data.progress,
        status: data.status,
        completedAt: data.completed_at,
      };

      // Get detailed requirements status
      const requirements = data.badges.requirements;
      let requirementDetails = [];

      if (requirements.courses) {
        for (const courseKey of requirements.courses) {
          const { data: moduleData } = await supabase
            .from('learning_modules')
            .select(`
              title,
              user_learning_progress!left (
                status,
                completed_at
              )
            `)
            .eq('module_key', courseKey)
            .eq('user_learning_progress.user_id', userId)
            .single();

          requirementDetails.push({
            type: 'course',
            id: courseKey,
            title: moduleData?.title || courseKey,
            completed: moduleData?.user_learning_progress?.[0]?.status === 'completed',
            completedAt: moduleData?.user_learning_progress?.[0]?.completed_at,
          });
        }
      }

      if (requirements.modules) {
        for (const moduleKey of requirements.modules) {
          const { data: moduleData } = await supabase
            .from('learning_modules')
            .select(`
              title,
              user_learning_progress!left (
                status,
                completed_at
              )
            `)
            .eq('module_key', moduleKey)
            .eq('user_learning_progress.user_id', userId)
            .single();

          requirementDetails.push({
            type: 'module',
            id: moduleKey,
            title: moduleData?.title || moduleKey,
            completed: moduleData?.user_learning_progress?.[0]?.status === 'completed',
            completedAt: moduleData?.user_learning_progress?.[0]?.completed_at,
          });
        }
      }

      if (requirements.module_count) {
        const { data: completedCount } = await supabase
          .from('user_learning_progress')
          .select('id', { count: 'exact' })
          .eq('user_id', userId)
          .eq('status', 'completed');

        requirementDetails.push({
          type: 'module_count',
          required: requirements.module_count,
          completed: completedCount?.length || 0,
          title: `Complete ${requirements.module_count} learning modules`,
        });
      }

      return {
        ...badge,
        requirementDetails,
      };
    } catch (error) {
      console.error('Error fetching badge details:', error);
      throw error;
    }
  },

  // Get recent badge achievements
  async getRecentAchievements(userId, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          completed_at,
          badges (
            badge_key,
            title,
            icon,
            xp_reward
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recent achievements:', error);
      throw error;
    }
  },

  // Initialize new user (called after signup)
  async initializeUserBadges(userId) {
    try {
      // This will be handled automatically by the database trigger
      // But we can call this function to ensure it happens
      const { data, error } = await supabase.rpc('initialize_user_badges_manual', {
        user_id_param: userId
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error initializing user badges:', error);
      throw error;
    }
  }
};