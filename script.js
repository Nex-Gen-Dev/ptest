console.log("1. Script has started loading...");

// --- YOUR CONNECTION ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';

// Attempt to connect to Supabase
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("2. Supabase connected.");

// --- THE TRANSITION ---
// This function hides the splash and shows the login
function showLogin() {
    console.log("3. Timer finished! Attempting to hide splash...");
    const splash = document.getElementById('splash');
    const login = document.getElementById('login-screen');

    if (splash && login) {
        splash.style.display = 'none';      // Force hide splash
        login.classList.remove('hidden');   // Show login
        console.log("4. Success! Splash is hidden.");
    } else {
        console.log("Error: Could not find splash or login-screen in HTML.");
    }
}

// Start the timer (Wait 3 seconds)
setTimeout(showLogin, 3000);

// --- LOGIN FUNCTION ---
let currentUser = "Guest";
function enterSite() {
    const nameInput = document.getElementById('username-input');
    if (nameInput && nameInput.value.trim() !== "") {
        currentUser = nameInput.value;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        switchChat('ai'); 
    } else {
        alert("Please enter your name.");
    }
}

// --- APP LOGIC ---
async function switchChat(key) {
    console.log("Switching to chat: " + key);
    const msgArea = document.getElementById('message-area');
    msgArea.innerHTML = 'Loading messages...';

    // Fetch from Supabase
    let { data: posts } = await _supabase.from('content').select('*').eq('category', key);

    msgArea.innerHTML = '';
    if (posts) {
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = "msg in";
            div.innerHTML = `<strong>${post.title}</strong><br>${post.body}`;
            msgArea.appendChild(div);
        });
    }
}