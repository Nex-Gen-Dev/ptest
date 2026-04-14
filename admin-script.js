// --- CONFIGURATION ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. AUTHOR AUTHENTICATION ---
async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const status = document.getElementById('login-status');

    status.innerText = "Authenticating...";
    status.style.color = "#54656f";

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        status.innerText = "Error: " + error.message;
        status.style.color = "red";
    } else {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        fetchInquiries(); // Load messages immediately after login
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    location.reload();
}

// --- 2. PUBLISH CONTENT (POSTS) ---
async function saveToSupabase() {
    const cat = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const status = document.getElementById('status-msg');

    status.innerText = "Publishing to Portal...";
    status.style.color = "blue";

    const { error } = await _supabase.from('content').insert([{ 
        category: cat, title: title, body: body 
    }]);

    if (error) {
        status.innerText = "RLS Error: " + error.message;
        status.style.color = "red";
    } else {
        status.innerText = "✅ Success! Content is live.";
        status.style.color = "green";
        document.getElementById('post-title').value = "";
        document.getElementById('post-body').value = "";
    }
}

// --- 3. FETCH AI INQUIRIES (INBOX) ---
async function fetchInquiries() {
    const inbox = document.getElementById('inbox-list');
    
    const { data: messages, error } = await _supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        inbox.innerHTML = `<p style="color:red;">Failed to load inbox: ${error.message}</p>`;
    } else if (messages && messages.length > 0) {
        inbox.innerHTML = '';
        messages.forEach(msg => {
            const time = new Date(msg.created_at).toLocaleString();
            const div = document.createElement('div');
            div.className = "inquiry-item";
            div.innerHTML = `
                <div class="inquiry-header">
                    <strong>${msg.sender}</strong>
                    <span>${time}</span>
                </div>
                <p>${msg.message}</p>
            `;
            inbox.appendChild(div);
        });
    } else {
        inbox.innerHTML = '<p style="text-align:center; color:#888;">No messages yet.</p>';
    }
}