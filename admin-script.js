// --- CONFIGURATION (Hardcoded for Chaim) ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. LOGIN LOGIC ---
async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const status = document.getElementById('login-status');

    status.innerText = "Authenticating...";
    status.style.color = "#54656f";

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        status.innerText = "Login Failed: " + error.message;
        status.style.color = "red";
    } else {
        // Hide login, show panel
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        
        // CRITICAL: Load inquiries immediately after login
        fetchInquiries();
    }
}

// --- 2. FETCH AI INQUIRIES (The Inbox) ---
async function fetchInquiries() {
    const inbox = document.getElementById('inbox-list');
    inbox.innerHTML = '<p style="text-align:center; color:blue;">Fetching messages from database...</p>';

    // Fetching from your "inquiries" table
    const { data: messages, error } = await _supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch Error:", error);
        inbox.innerHTML = `<p style="color:red; padding:10px;"><b>Error:</b> ${error.message}<br><small>Make sure your RLS Policy allows "SELECT" for Authenticated users.</small></p>`;
        return;
    }

    if (!messages || messages.length === 0) {
        inbox.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">No messages found in the "inquiries" table yet.</p>';
        return;
    }

    // Clear and build the list
    inbox.innerHTML = '';
    messages.forEach(msg => {
        const date = new Date(msg.created_at).toLocaleString();
        const item = document.createElement('div');
        item.style = "background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:12px; border-left:5px solid #00a884; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#667781; margin-bottom:8px;">
                <strong>Sender: ${msg.sender || 'Anonymous'}</strong>
                <span>${date}</span>
            </div>
            <p style="margin:0; color:#111b21; line-height:1.4;">${msg.message}</p>
        `;
        inbox.appendChild(item);
    });
}

// --- 3. PUBLISH CONTENT ---
async function saveToSupabase() {
    const cat = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const status = document.getElementById('status-msg');

    status.innerText = "Publishing...";
    status.style.color = "blue";

    const { error } = await _supabase.from('content').insert([{ 
        category: cat, title: title, body: body 
    }]);

    if (error) {
        status.innerText = "Error: " + error.message;
        status.style.color = "red";
    } else {
        status.innerText = "✅ Successfully Posted!";
        status.style.color = "green";
        document.getElementById('post-title').value = "";
        document.getElementById('post-body').value = "";
    }
}

// --- 4. LOGOUT ---
async function handleLogout() {
    await _supabase.auth.signOut();
    location.reload();
}