// ----------------------------------------------------
// Aegis AI - Vulnerable Test File
// ----------------------------------------------------

// 1. HARDCODED SECRET
const AWS_SECRET_KEY = "AKIAIOSFODNN7EXAMPLE";
const DB_PASSWORD = 'super_secret_password_123';

function authenticate(user) {
    console.log("Authenticating user: " + user);
}

// 2. SQL INJECTION
function getUserById(id) {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    db.execute(query);
}

// 3. CROSS-SITE SCRIPTING (XSS)
function renderProfile(req, res) {
    const userProfile = document.getElementById('profile');
    // Rentan terhadap XSS karena innerHTML
    userProfile.innerHTML = "<h1>Welcome " + req.query.username + "</h1>";
}

// 4. WEAK CRYPTOGRAPHY
function generateToken() {
    // Tidak aman secara kriptografi
    const token = Math.random().toString(36).substring(2);
    return token;
}

module.exports = {
    authenticate,
    getUserById,
    renderProfile,
    generateToken
};
