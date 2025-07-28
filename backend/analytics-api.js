//backend/analytics-api.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Debug: Log environment variables
console.log('🔧 Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
});

// Helper function for date ranges
const getDateFilter = (period) => {
  switch (period) {
    case 'today':
      return `created_at >= CURRENT_DATE`;
    case 'week':
      return `created_at >= CURRENT_DATE - INTERVAL '7 days'`;
    case 'month':
      return `created_at >= CURRENT_DATE - INTERVAL '30 days'`;
    case 'quarter':
      return `created_at >= CURRENT_DATE - INTERVAL '90 days'`;
    default:
      return '1=1';
  }
};

// Test database connection
pool.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// 1. USER METRICS
app.get('/api/analytics/users/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const queries = await Promise.all([
      // Total users
      pool.query(`SELECT COUNT(*) as total_users FROM users WHERE ${dateFilter}`),
      
      // Active vs deleted users
      pool.query(`
        SELECT 
          COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) as active_users,
          COUNT(CASE WHEN deleted_at IS NOT NULL THEN 1 END) as deleted_users
        FROM users WHERE ${dateFilter}
      `),
      
      // Email verification rate
      pool.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(email_verified_at) as verified_users,
          ROUND((COUNT(email_verified_at)::numeric / COUNT(*) * 100), 2) as verification_rate
        FROM users WHERE ${dateFilter}
      `),
      
      // Users by persona type
      pool.query(`
        SELECT persona_type, COUNT(*) as count 
        FROM users 
        WHERE ${dateFilter} 
        GROUP BY persona_type
      `),
      
      // Users by auth type
      pool.query(`
        SELECT auth_type, COUNT(*) as count 
        FROM users 
        WHERE ${dateFilter}
        GROUP BY auth_type
      `)
    ]);

    res.json({
      totalUsers: queries[0].rows[0],
      userStatus: queries[1].rows[0],
      verification: queries[2].rows[0],
      byPersonaType: queries[3].rows,
      byAuthType: queries[4].rows
    });
  } catch (error) {
    console.error('Error in /users/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/users/growth', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users,
        SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_users
      FROM users 
      WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in /users/growth:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. PROFILE METRICS
app.get('/api/analytics/profiles/completion', async (req, res) => {
  try {
    const queries = await Promise.all([
      // Profile completion stats
      pool.query(`
        SELECT 
          COUNT(*) as total_profiles,
          COUNT(CASE WHEN name IS NOT NULL AND industry IS NOT NULL AND country IS NOT NULL THEN 1 END) as complete_profiles,
          COUNT(CASE WHEN linkedin IS NOT NULL THEN 1 END) as profiles_with_linkedin,
          COUNT(CASE WHEN cv_url IS NOT NULL THEN 1 END) as profiles_with_cv,
          COUNT(CASE WHEN avatar IS NOT NULL THEN 1 END) as profiles_with_avatar
        FROM user_information
      `),
      
      // Industry distribution
      pool.query(`
        SELECT industry, COUNT(*) as count 
        FROM user_information 
        WHERE industry IS NOT NULL 
        GROUP BY industry 
        ORDER BY count DESC
      `),
      
      // Country distribution
      pool.query(`
        SELECT country, COUNT(*) as count 
        FROM user_information 
        WHERE country IS NOT NULL 
        GROUP BY country 
        ORDER BY count DESC 
        LIMIT 10
      `)
    ]);

    res.json({
      completion: queries[0].rows[0],
      byIndustry: queries[1].rows,
      byCountry: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /profiles/completion:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. IDEA METRICS
app.get('/api/analytics/ideas/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const queries = await Promise.all([
      // Total ideas
      pool.query(`SELECT COUNT(*) as total_ideas FROM ideas WHERE ${dateFilter}`),
      
      // Ideas by stage
      pool.query(`
        SELECT stage, COUNT(*) as count 
        FROM ideas 
        WHERE ${dateFilter}
        GROUP BY stage
      `),
      
      // Ideas by target audience
      pool.query(`
        SELECT targeted_audience, COUNT(*) as count 
        FROM ideas 
        WHERE ${dateFilter} AND targeted_audience IS NOT NULL
        GROUP BY targeted_audience 
        ORDER BY count DESC
      `),
      
      // Ideas with attachments
      pool.query(`
        SELECT 
          COUNT(*) as total_ideas,
          COUNT(CASE WHEN pitch_deck IS NOT NULL THEN 1 END) as with_pitch_deck,
          COUNT(CASE WHEN voice_note IS NOT NULL THEN 1 END) as with_voice_note,
          COUNT(CASE WHEN document IS NOT NULL THEN 1 END) as with_document
        FROM ideas WHERE ${dateFilter}
      `)
    ]);

    res.json({
      total: queries[0].rows[0],
      byStage: queries[1].rows,
      byAudience: queries[2].rows,
      attachments: queries[3].rows[0]
    });
  } catch (error) {
    console.error('Error in /ideas/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/ideas/trends', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as ideas_submitted,
        COUNT(CASE WHEN stage = 'ideation' THEN 1 END) as ideation_stage,
        COUNT(CASE WHEN stage = 'prototype' THEN 1 END) as prototype_stage,
        COUNT(CASE WHEN stage = 'beta' THEN 1 END) as beta_stage
      FROM ideas 
      WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in /ideas/trends:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. FORM METRICS
app.get('/api/analytics/forms/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = getDateFilter(period);

    const queries = await Promise.all([
      // Form stats
      pool.query(`
        SELECT 
          COUNT(*) AS total_forms,
          COUNT(CASE WHEN form_url IS NOT NULL THEN 1 END) AS forms_with_url
        FROM forms
        WHERE ${dateFilter}
      `),

      // Form completion rate
      pool.query(`
        SELECT 
        COUNT(DISTINCT f.id) AS total_forms,
        COUNT(DISTINCT fr.form_id) AS forms_with_responses,
        ROUND((COUNT(DISTINCT fr.form_id)::numeric / NULLIF(COUNT(DISTINCT f.id)::numeric, 0) * 100), 2) AS completion_rate
        FROM forms f
        LEFT JOIN form_responses fr ON f.id = fr.form_id
        WHERE ${dateFilter}
      `),

      // Response distribution
      pool.query(`
        SELECT 
          f.id AS form_id,
          f.idea_id,
          COUNT(fr.id) AS response_count
        FROM forms f
        LEFT JOIN form_responses fr ON f.id = fr.form_id
        WHERE ${dateFilter}
        GROUP BY f.id, f.idea_id
        ORDER BY response_count DESC
      `),

      // Total responses
      pool.query(`
        SELECT COUNT(*) AS total_responses
        FROM form_responses
        WHERE ${dateFilter}
      `)
    ]);

    res.json({
      forms: queries[0].rows[0],
      completion: queries[1].rows[0],
      responseDistribution: queries[2].rows,
      totalResponses: queries[3].rows[0]
    });
  } catch (error) {
    console.error('Error in /forms/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 5. BOOKING METRICS
app.get('/api/analytics/bookings/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = period === 'all' ? '1=1' : `start_time >= CURRENT_DATE - INTERVAL '${period === 'week' ? '7' : period === 'month' ? '30' : '90'} days'`;
    
    const queries = await Promise.all([
      // Booking stats
      pool.query(`
        SELECT 
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN transcript_url IS NOT NULL THEN 1 END) as with_transcript,
          COUNT(CASE WHEN video_recording_url IS NOT NULL THEN 1 END) as with_recording
        FROM bookings WHERE ${dateFilter}
      `),
      
      // Average session duration
      pool.query(`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_duration_minutes,
          COUNT(*) as completed_sessions
        FROM bookings 
        WHERE end_time IS NOT NULL AND start_time IS NOT NULL AND ${dateFilter}
      `)
    ]);

    res.json({
      overview: queries[0].rows[0],
      duration: queries[1].rows[0]
    });
  } catch (error) {
    console.error('Error in /bookings/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 6. ENGAGEMENT FLOW METRICS
app.get('/api/analytics/engagement/funnel', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT ui.user_id) as users_with_profiles,
        COUNT(DISTINCT i.user_id) as users_with_ideas,
        COUNT(DISTINCT f.creator_id) as users_with_forms,
        COUNT(DISTINCT fr.responder_id) as users_with_responses,
        COUNT(DISTINCT b.creator_id) as users_with_bookings
      FROM users u
      LEFT JOIN user_information ui ON u.id = ui.user_id
      LEFT JOIN ideas i ON u.id = i.user_id
      LEFT JOIN forms f ON u.id = f.creator_id
      LEFT JOIN form_responses fr ON u.id = fr.responder_id
      LEFT JOIN bookings b ON u.id = b.creator_id
    `;
    
    const result = await pool.query(query);
    res.json({
      userJourney: result.rows[0]
    });
  } catch (error) {
    console.error('Error in /engagement/funnel:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 7. REAL-TIME METRICS
app.get('/api/analytics/realtime', async (req, res) => {
  try {
    const queries = await Promise.all([
      // Today's activity
      pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE) as new_users_today,
          (SELECT COUNT(*) FROM ideas WHERE DATE(created_at) = CURRENT_DATE) as new_ideas_today,
          (SELECT COUNT(*) FROM form_responses WHERE DATE(created_at) = CURRENT_DATE) as new_responses_today,
          (SELECT COUNT(*) FROM bookings WHERE DATE(start_time) = CURRENT_DATE) as bookings_today
      `),
      
      // Recent activity
      pool.query(`
        (SELECT 'user' as type, created_at, email as description FROM users ORDER BY created_at DESC LIMIT 5)
        UNION ALL
        (SELECT 'idea' as type, created_at, name as description FROM ideas ORDER BY created_at DESC LIMIT 5)
        UNION ALL
        (SELECT 'response' as type, created_at, CONCAT('Form ', form_id) as description FROM form_responses ORDER BY created_at DESC LIMIT 5)
        ORDER BY created_at DESC
        LIMIT 15
      `)
    ]);

    res.json({
      today: queries[0].rows[0],
      recentActivity: queries[1].rows
    });
  } catch (error) {
    console.error('Error in /realtime:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check tables
app.get('/api/test/tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    res.json({
      tables: result.rows.map(row => row.tablename),
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Analytics API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Test tables: http://localhost:${PORT}/api/test/tables`);
});

// Add these new endpoints to your existing analytics-api.js file

// ================================
// CREATOR METRICS ENDPOINTS
// ================================

// Creator Overview & Journey
app.get('/api/analytics/creators/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const queries = await Promise.all([
      // Creator funnel metrics
      pool.query(`
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT CASE WHEN u.persona_type = 'founder' THEN u.id END) as identified_creators,
          COUNT(DISTINCT ui.user_id) as creators_with_profiles,
          COUNT(DISTINCT i.user_id) as creators_with_ideas,
          COUNT(DISTINCT f.creator_id) as creators_with_forms,
          COUNT(DISTINCT fr.responder_id) as creators_as_responders
        FROM users u
        LEFT JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN ideas i ON u.id = i.user_id
        LEFT JOIN forms f ON u.id = f.creator_id
        LEFT JOIN form_responses fr ON u.id = fr.responder_id
        WHERE u.${dateFilter}
      `),
      
      // Creator persona breakdown
      pool.query(`
        SELECT 
          persona_type,
          COUNT(*) as count,
          COUNT(CASE WHEN email_verified_at IS NOT NULL THEN 1 END) as verified,
          ROUND(AVG(EXTRACT(DAYS FROM NOW() - created_at)), 1) as avg_days_since_signup
        FROM users 
        WHERE ${dateFilter}
        GROUP BY persona_type 
        ORDER BY count DESC
      `),
      
      // Creator engagement levels
      pool.query(`
        SELECT 
          CASE 
            WHEN idea_count >= 3 THEN 'High Engagement'
            WHEN idea_count >= 1 THEN 'Medium Engagement'
            WHEN profile_complete THEN 'Profile Only'
            ELSE 'Low Engagement'
          END as engagement_level,
          COUNT(*) as creator_count
        FROM (
          SELECT 
            u.id,
            COUNT(i.id) as idea_count,
            CASE WHEN ui.name IS NOT NULL AND ui.industry IS NOT NULL THEN true ELSE false END as profile_complete
          FROM users u
          LEFT JOIN ideas i ON u.id = i.user_id
          LEFT JOIN user_information ui ON u.id = ui.user_id
          WHERE u.${dateFilter}
          GROUP BY u.id, ui.name, ui.industry
        ) creator_stats
        GROUP BY engagement_level
      `)
    ]);

    res.json({
      funnel: queries[0].rows[0],
      byPersona: queries[1].rows,
      engagementLevels: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /creators/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Creator Demographics
app.get('/api/analytics/creators/demographics', async (req, res) => {
  try {
    const queries = await Promise.all([
      // Industry distribution for creators
      pool.query(`
        SELECT 
          ui.industry,
          COUNT(*) as count,
          COUNT(i.id) as ideas_created,
          COUNT(f.id) as forms_created
        FROM users u
        JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN ideas i ON u.id = i.user_id
        LEFT JOIN forms f ON u.id = f.creator_id
        WHERE ui.industry IS NOT NULL
        GROUP BY ui.industry
        ORDER BY count DESC
      `),
      
      // Geographic distribution
      pool.query(`
        SELECT 
          ui.country,
          COUNT(*) as count,
          COUNT(CASE WHEN u.persona_type = 'founder' THEN 1 END) as founders,
          COUNT(i.id) as total_ideas
        FROM users u
        JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN ideas i ON u.id = i.user_id
        WHERE ui.country IS NOT NULL
        GROUP BY ui.country
        ORDER BY count DESC
      `),
      
      // Age and experience distribution
      pool.query(`
        SELECT 
          CASE 
            WHEN ui.age < 25 THEN 'Under 25'
            WHEN ui.age < 35 THEN '25-34'
            WHEN ui.age < 45 THEN '35-44'
            ELSE '45+'
          END as age_group,
          ui.experience,
          COUNT(*) as count
        FROM users u
        JOIN user_information ui ON u.id = ui.user_id
        WHERE ui.age IS NOT NULL
        GROUP BY age_group, ui.experience
        ORDER BY age_group, ui.experience
      `)
    ]);

    res.json({
      byIndustry: queries[0].rows,
      byCountry: queries[1].rows,
      ageExperience: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /creators/demographics:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Creator Performance
app.get('/api/analytics/creators/performance', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const queries = await Promise.all([
      // Creator activity trends
      pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(CASE WHEN persona_type = 'founder' THEN 1 END) as new_creators,
          COUNT(*) as total_new_users
        FROM users 
        WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `),
      
      // Top performing creators
      pool.query(`
        SELECT 
          u.id,
          ui.name,
          ui.industry,
          COUNT(DISTINCT i.id) as ideas_count,
          COUNT(DISTINCT f.id) as forms_count,
          COUNT(DISTINCT fr.id) as responses_received,
          u.created_at
        FROM users u
        LEFT JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN ideas i ON u.id = i.user_id
        LEFT JOIN forms f ON u.id = f.creator_id
        LEFT JOIN form_responses fr ON f.id = fr.form_id
        WHERE u.persona_type = 'founder' OR i.id IS NOT NULL
        GROUP BY u.id, ui.name, ui.industry, u.created_at
        ORDER BY ideas_count DESC, forms_count DESC
        LIMIT 10
      `),
      
      // Creator conversion rates
      pool.query(`
        SELECT 
          'Registration to Profile' as conversion_step,
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT ui.user_id) as converted_users,
          ROUND((COUNT(DISTINCT ui.user_id)::float / COUNT(DISTINCT u.id) * 100), 2) as conversion_rate
        FROM users u
        LEFT JOIN user_information ui ON u.id = ui.user_id
        
        UNION ALL
        
        SELECT 
          'Profile to First Idea' as conversion_step,
          COUNT(DISTINCT ui.user_id) as total_users,
          COUNT(DISTINCT i.user_id) as converted_users,
          ROUND((COUNT(DISTINCT i.user_id)::float / COUNT(DISTINCT ui.user_id) * 100), 2) as conversion_rate
        FROM user_information ui
        LEFT JOIN ideas i ON ui.user_id = i.user_id
        
        UNION ALL
        
        SELECT 
          'Idea to First Form' as conversion_step,
          COUNT(DISTINCT i.user_id) as total_users,
          COUNT(DISTINCT f.creator_id) as converted_users,
          ROUND((COUNT(DISTINCT f.creator_id)::float / COUNT(DISTINCT i.user_id) * 100), 2) as conversion_rate
        FROM ideas i
        LEFT JOIN forms f ON i.user_id = f.creator_id
      `)
    ]);

    res.json({
      activityTrends: queries[0].rows,
      topCreators: queries[1].rows,
      conversionRates: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /creators/performance:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ================================
// SME METRICS ENDPOINTS
// ================================

// SME Overview
app.get('/api/analytics/sme/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const queries = await Promise.all([
      // SME basic metrics
      pool.query(`
        SELECT 
          COUNT(CASE WHEN persona_type = 'sme' THEN 1 END) as total_smes,
          COUNT(CASE WHEN persona_type = 'sme' AND email_verified_at IS NOT NULL THEN 1 END) as verified_smes,
          COUNT(DISTINCT b.participant_id) as active_smes,
          COUNT(DISTINCT fr.responder_id) as responding_smes
        FROM users u
        LEFT JOIN bookings b ON u.id = b.participant_id
        LEFT JOIN form_responses fr ON u.id = fr.responder_id
        WHERE u.${dateFilter}
      `),
      
      // SME readiness metrics
      pool.query(`
        SELECT 
          COUNT(*) as total_smes,
          COUNT(CASE WHEN ui.name IS NOT NULL AND ui.industry IS NOT NULL THEN 1 END) as profile_complete,
          COUNT(CASE WHEN ui.linkedin IS NOT NULL THEN 1 END) as with_linkedin,
          COUNT(CASE WHEN ui.cv_url IS NOT NULL THEN 1 END) as with_cv,
          COUNT(CASE WHEN ui.available_time_slots IS NOT NULL THEN 1 END) as with_availability
        FROM users u
        LEFT JOIN user_information ui ON u.id = ui.user_id
        WHERE u.persona_type = 'sme'
      `),
      
      // SME engagement distribution
      pool.query(`
        SELECT 
          CASE 
            WHEN booking_count > 0 THEN 'Active (Has Bookings)'
            WHEN response_count > 0 THEN 'Responding (Survey Only)'
            WHEN profile_complete THEN 'Ready (Profile Complete)'
            ELSE 'Inactive (Incomplete Profile)'
          END as engagement_status,
          COUNT(*) as sme_count
        FROM (
          SELECT 
            u.id,
            COUNT(b.id) as booking_count,
            COUNT(fr.id) as response_count,
            CASE WHEN ui.name IS NOT NULL AND ui.industry IS NOT NULL THEN true ELSE false END as profile_complete
          FROM users u
          LEFT JOIN bookings b ON u.id = b.participant_id
          LEFT JOIN form_responses fr ON u.id = fr.responder_id
          LEFT JOIN user_information ui ON u.id = ui.user_id
          WHERE u.persona_type = 'sme'
          GROUP BY u.id, ui.name, ui.industry
        ) sme_stats
        GROUP BY engagement_status
        ORDER BY sme_count DESC
      `)
    ]);

    res.json({
      overview: queries[0].rows[0],
      readiness: queries[1].rows[0],
      engagementStatus: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /sme/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// SME Demographics & Expertise
app.get('/api/analytics/sme/expertise', async (req, res) => {
  try {
    const queries = await Promise.all([
      // SME by industry expertise
      pool.query(`
        SELECT 
          ui.industry,
          COUNT(*) as sme_count,
          COUNT(CASE WHEN ui.experience IS NOT NULL THEN 1 END) as with_experience,
          AVG(CASE WHEN ui.age IS NOT NULL THEN ui.age END) as avg_age
        FROM users u
        JOIN user_information ui ON u.id = ui.user_id
        WHERE u.persona_type = 'sme' AND ui.industry IS NOT NULL
        GROUP BY ui.industry
        ORDER BY sme_count DESC
      `),
      
      // SME geographic distribution
      pool.query(`
        SELECT 
          ui.country,
          COUNT(*) as sme_count,
          COUNT(CASE WHEN ui.linkedin IS NOT NULL THEN 1 END) as with_linkedin
        FROM users u
        JOIN user_information ui ON u.id = ui.user_id
        WHERE u.persona_type = 'sme' AND ui.country IS NOT NULL
        GROUP BY ui.country
        ORDER BY sme_count DESC
      `),
      
      // SME profile completion breakdown
      pool.query(`
        SELECT 
          ui.name,
          ui.industry,
          ui.profile_title,
          ui.country,
          CASE WHEN ui.linkedin IS NOT NULL THEN 'Yes' ELSE 'No' END as has_linkedin,
          CASE WHEN ui.cv_url IS NOT NULL THEN 'Yes' ELSE 'No' END as has_cv,
          u.email_verified_at IS NOT NULL as email_verified,
          u.created_at
        FROM users u
        LEFT JOIN user_information ui ON u.id = ui.user_id
        WHERE u.persona_type = 'sme'
        ORDER BY u.created_at DESC
      `)
    ]);

    res.json({
      byIndustry: queries[0].rows,
      byCountry: queries[1].rows,
      profiles: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /sme/expertise:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// SME Performance & Activity
app.get('/api/analytics/sme/performance', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const queries = await Promise.all([
      // SME registration trends
      pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(CASE WHEN persona_type = 'sme' THEN 1 END) as new_smes,
          COUNT(*) as total_registrations
        FROM users 
        WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `),
      
      // SME response activity
      pool.query(`
        SELECT 
          u.id as sme_id,
          ui.name,
          ui.industry,
          COUNT(fr.id) as responses_given,
          COUNT(DISTINCT fr.form_id) as unique_forms_responded,
          MIN(fr.created_at) as first_response_date,
          MAX(fr.created_at) as last_response_date
        FROM users u
        LEFT JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN form_responses fr ON u.id = fr.responder_id
        WHERE u.persona_type = 'sme'
        GROUP BY u.id, ui.name, ui.industry
        ORDER BY responses_given DESC
      `),
      
      // SME availability and utilization (when booking data becomes available)
      pool.query(`
        SELECT 
          'Total SMEs' as metric,
          COUNT(*) as value
        FROM users 
        WHERE persona_type = 'sme'
        
        UNION ALL
        
        SELECT 
          'SMEs with Profiles' as metric,
          COUNT(*) as value
        FROM users u
        JOIN user_information ui ON u.id = ui.user_id
        WHERE u.persona_type = 'sme' AND ui.name IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'Active SMEs (Responded)' as metric,
          COUNT(DISTINCT fr.responder_id) as value
        FROM form_responses fr
        JOIN users u ON fr.responder_id = u.id
        WHERE u.persona_type = 'sme'
      `)
    ]);

    res.json({
      registrationTrends: queries[0].rows,
      topPerformers: queries[1].rows,
      utilizationMetrics: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /sme/performance:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ================================
// IDEAS METRICS ENDPOINTS
// ================================

// Ideas Overview
app.get('/api/analytics/ideas/overview', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const queries = await Promise.all([
      // Ideas basic metrics
      pool.query(`
        SELECT 
          COUNT(*) as total_ideas,
          COUNT(CASE WHEN pitch_deck IS NOT NULL THEN 1 END) as with_pitch_deck,
          COUNT(CASE WHEN voice_note IS NOT NULL THEN 1 END) as with_voice_note,
          COUNT(CASE WHEN document IS NOT NULL THEN 1 END) as with_document,
          COUNT(CASE WHEN ai_request_id IS NOT NULL THEN 1 END) as ai_processed
        FROM ideas 
        WHERE ${dateFilter}
      `),
      
      // Ideas by stage
      pool.query(`
        SELECT 
          stage,
          COUNT(*) as count,
          COUNT(CASE WHEN pitch_deck IS NOT NULL THEN 1 END) as with_attachments,
          ROUND(AVG(EXTRACT(DAYS FROM NOW() - created_at)), 1) as avg_days_old
        FROM ideas 
        WHERE ${dateFilter}
        GROUP BY stage 
        ORDER BY count DESC
      `),
      
      // Ideas by target audience
      pool.query(`
        SELECT 
          targeted_audience,
          COUNT(*) as count,
          COUNT(DISTINCT f.id) as forms_created,
          COUNT(DISTINCT fr.id) as responses_received
        FROM ideas i
        LEFT JOIN forms f ON i.id = f.idea_id
        LEFT JOIN form_responses fr ON f.id = fr.form_id
        WHERE i.${dateFilter} AND i.targeted_audience IS NOT NULL
        GROUP BY targeted_audience 
        ORDER BY count DESC
      `),
      
      // AI processing pipeline status
      pool.query(`
        SELECT 
          COUNT(*) as total_ideas,
          COUNT(CASE WHEN idea_capture IS NOT NULL THEN 1 END) as idea_capture_complete,
          COUNT(CASE WHEN lens_selector IS NOT NULL THEN 1 END) as lens_selector_complete,
          COUNT(CASE WHEN survey_generator IS NOT NULL THEN 1 END) as survey_generator_complete,
          ROUND((COUNT(CASE WHEN idea_capture IS NOT NULL THEN 1 END)::float / COUNT(*) * 100), 2) as idea_capture_rate,
          ROUND((COUNT(CASE WHEN lens_selector IS NOT NULL THEN 1 END)::float / COUNT(*) * 100), 2) as lens_selector_rate,
          ROUND((COUNT(CASE WHEN survey_generator IS NOT NULL THEN 1 END)::float / COUNT(*) * 100), 2) as survey_generator_rate
        FROM ideas 
        WHERE ${dateFilter}
      `)
    ]);

    res.json({
      overview: queries[0].rows[0],
      byStage: queries[1].rows,
      byAudience: queries[2].rows,
      aiPipeline: queries[3].rows[0]
    });
  } catch (error) {
    console.error('Error in /ideas/overview:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ideas Validation Pipeline
app.get('/api/analytics/ideas/validation', async (req, res) => {
  try {
    const queries = await Promise.all([
      // Validation funnel
      pool.query(`
        SELECT 
          COUNT(DISTINCT i.id) as total_ideas,
          COUNT(DISTINCT f.id) as forms_created,
          COUNT(DISTINCT fr.form_id) as forms_with_responses,
          COUNT(DISTINCT fr.id) as total_responses,
          ROUND((COUNT(DISTINCT f.id)::float / COUNT(DISTINCT i.id) * 100), 2) as form_creation_rate,
          ROUND((COUNT(DISTINCT fr.form_id)::float / COUNT(DISTINCT f.id) * 100), 2) as response_rate,
          ROUND((COUNT(DISTINCT fr.id)::float / COUNT(DISTINCT f.id)), 2) as avg_responses_per_form
        FROM ideas i
        LEFT JOIN forms f ON i.id = f.idea_id
        LEFT JOIN form_responses fr ON f.id = fr.form_id
      `),
      
      // Idea performance breakdown
      pool.query(`
        SELECT 
          i.id,
          i.name,
          i.stage,
          i.targeted_audience,
          ui.name as creator_name,
          COUNT(f.id) as forms_count,
          COUNT(fr.id) as responses_count,
          i.created_at,
          CASE WHEN i.ai_request_id IS NOT NULL THEN 'Yes' ELSE 'No' END as ai_processed
        FROM ideas i
        LEFT JOIN users u ON i.user_id = u.id
        LEFT JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN forms f ON i.id = f.idea_id
        LEFT JOIN form_responses fr ON f.id = fr.form_id
        GROUP BY i.id, i.name, i.stage, i.targeted_audience, ui.name, i.created_at, i.ai_request_id
        ORDER BY responses_count DESC, forms_count DESC, i.created_at DESC
      `),
      
      // Content analysis
      pool.query(`
        SELECT 
          'Ideas with Pitch Decks' as content_type,
          COUNT(CASE WHEN pitch_deck IS NOT NULL THEN 1 END) as count,
          ROUND((COUNT(CASE WHEN pitch_deck IS NOT NULL THEN 1 END)::float / COUNT(*) * 100), 2) as percentage
        FROM ideas
        
        UNION ALL
        
        SELECT 
          'Ideas with Voice Notes' as content_type,
          COUNT(CASE WHEN voice_note IS NOT NULL THEN 1 END) as count,
          ROUND((COUNT(CASE WHEN voice_note IS NOT NULL THEN 1 END)::float / COUNT(*) * 100), 2) as percentage
        FROM ideas
        
        UNION ALL
        
        SELECT 
          'Ideas with Documents' as content_type,
          COUNT(CASE WHEN document IS NOT NULL THEN 1 END) as count,
          ROUND((COUNT(CASE WHEN document IS NOT NULL THEN 1 END)::float / COUNT(*) * 100), 2) as percentage
        FROM ideas
      `)
    ]);

    res.json({
      validationFunnel: queries[0].rows[0],
      ideaPerformance: queries[1].rows,
      contentAnalysis: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /ideas/validation:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ideas Trends & Growth
app.get('/api/analytics/ideas/trends', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const queries = await Promise.all([
      // Daily idea submissions (updated to use real stage values)
      pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as total_ideas,
          COUNT(CASE WHEN stage = 'IDEATION & PLANNING' THEN 1 END) as ideation_planning,
          COUNT(CASE WHEN pitch_deck IS NOT NULL THEN 1 END) as with_pitch_deck,
          COUNT(CASE WHEN ai_request_id IS NOT NULL THEN 1 END) as ai_processed
        FROM ideas 
        WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `),
      
      // Creator productivity
      pool.query(`
        SELECT 
          u.id as creator_id,
          ui.name as creator_name,
          COUNT(i.id) as ideas_submitted,
          COUNT(f.id) as forms_created,
          COUNT(fr.id) as responses_received,
          MIN(i.created_at) as first_idea_date,
          MAX(i.created_at) as latest_idea_date
        FROM users u
        JOIN ideas i ON u.id = i.user_id
        LEFT JOIN user_information ui ON u.id = ui.user_id
        LEFT JOIN forms f ON i.id = f.idea_id
        LEFT JOIN form_responses fr ON f.id = fr.form_id
        GROUP BY u.id, ui.name
        ORDER BY ideas_submitted DESC, responses_received DESC
      `),
      
      // Success metrics trends
      pool.query(`
        SELECT 
          'Total Ideas Submitted' as metric,
          COUNT(*) as current_value,
          0 as previous_value
        FROM ideas
        
        UNION ALL
        
        SELECT 
          'Forms Created from Ideas' as metric,
          COUNT(DISTINCT f.id) as current_value,
          0 as previous_value
        FROM ideas i
        LEFT JOIN forms f ON i.id = f.idea_id
        
        UNION ALL
        
        SELECT 
          'Ideas with Responses' as metric,
          COUNT(DISTINCT i.id) as current_value,
          0 as previous_value
        FROM ideas i
        JOIN forms f ON i.id = f.idea_id
        JOIN form_responses fr ON f.id = fr.form_id
      `)
    ]);

    res.json({
      submissionTrends: queries[0].rows,
      creatorProductivity: queries[1].rows,
      successMetrics: queries[2].rows
    });
  } catch (error) {
    console.error('Error in /ideas/trends:', error.message);
    res.status(500).json({ error: error.message });
  }
});