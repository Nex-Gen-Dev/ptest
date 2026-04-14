const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. THE LOGIN ACTION
async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const status = document.getElementById('login-status');

    status.innerText = "Checking credentials...";
    status.style.color = "blue";

    // This is the "ID Card" check
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        status.innerText = "Login Failed: " + error.message;
        status.style.color = "red";
    } else {
        // If login is successful, hide the login box and show the post form
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        console.log("Logged in as:", data.user.email);
    }
}

// 2. THE POST ACTION
async function saveToSupabase() {
    const cat = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const status = document.getElementById('status-msg');

    status.innerText = "Publishing...";
    status.style.color = "blue";

    // Supabase now sees you are logged in!
    const { error } = await _supabase.from('content').insert([{ 
        category: cat, title: title, body: body 
    }]);

    if (error) {
        status.innerText = "Error: " + error.message;
        status.style.color = "red";
    } else {
        status.innerText = "✅ Successfully Posted to Chaim's Portal!";
        status.style.color = "green";
        document.getElementById('post-title').value = "";
        document.getElementById('post-body').value = "";
    }
}

// 3. LOGOUT
async function handleLogout() {
    await _supabase.auth.signOut();
    location.reload();
}