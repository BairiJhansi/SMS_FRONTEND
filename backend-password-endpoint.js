// Backend API Endpoint for fetching password_hash from erd_db
// Add this to your backend server (Node.js/Express)

const { Pool } = require('pg');

// PostgreSQL connection to erd_db
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'erd_db',
  password: 'your_postgres_password', // Update with your actual password
  port: 5432,
});

// GET /api/auth/user-password/:id - Fetch user with password_hash
app.get('/api/auth/user-password/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Fetching password_hash for user ID:', userId);
    
    // SQL Query to fetch user with password_hash from erd_db.users table
    const query = `
      SELECT id, user_id, username, admission_number, email, password_hash 
      FROM users 
      WHERE user_id = $1 OR id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    console.log('Database result:', result.rows);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('User found:', user.username);
      
      // Return user data with password_hash
      res.json({
        id: user.id,
        user_id: user.user_id,
        username: user.username,
        admission_number: user.admission_number,
        email: user.email,
        password_hash: user.password_hash,
        // For Moodle compatibility, also return as password
        password: user.password_hash
      });
    } else {
      console.log('User not found for ID:', userId);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Alternative: GET /api/auth/user-by-username/:username
app.get('/api/auth/user-by-username/:username', async (req, res) => {
  try {
    const username = req.params.username;
    console.log('Searching for username:', username);
    
    const query = `
      SELECT id, user_id, username, admission_number, email, password_hash 
      FROM users 
      WHERE username = $1 OR admission_number = $1
    `;
    
    const result = await pool.query(query, [username]);
    console.log('Search result:', result.rows);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        id: user.id,
        user_id: user.user_id,
        username: user.username,
        admission_number: user.admission_number,
        email: user.email,
        password_hash: user.password_hash,
        password: user.password_hash
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint to check database connection
app.get('/api/auth/test-db', async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) as user_count 
      FROM users
    `;
    
    const result = await pool.query(query);
    res.json({
      message: 'Database connection successful',
      user_count: result.rows[0].user_count,
      database: 'erd_db'
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed: ' + error.message });
  }
});
