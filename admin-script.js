const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- TAB SYSTEM ---
function showTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-title').innerText = el.innerText;
}

// --- AUTH ---
async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) { alert("Login failed: " + error.message); }
    else {
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('dashboard-content').classList.remove('hidden');
        fetchInquiries(); 
    }
}

// --- SAVE CONTENT (Vlogs/Blogs) ---
async function saveContent() {
    const cat = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const { error } = await _supabase.from('content').insert([{ category: cat, title, body }]);
    if (error) alert(error.message); else alert("Content Live!");
}

// --- SAVE EVENT ---
async function saveEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const loc = document.getElementById('event-location').value;
    const { error } = await _supabase.from('events').insert([{ title, date, location: loc }]);
    if (error) alert(error.message); else alert("Event Scheduled!");
}

async function savePoll() {
    const question = document.getElementById('poll-question').value;
    const imgUrl = document.getElementById('poll-image').value; // Add this input to your HTML
    const options = document.getElementById('poll-options').value;

    const { error } = await _supabase.from('polls').insert([{ 
        question, 
        image_url: imgUrl, 
        options: options 
    }]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("🚀 Poll launched with visuals!");
        // Clear inputs
        document.getElementById('poll-question').value = "";
        document.getElementById('poll-image').value = "";
        document.getElementById('poll-options').value = "";
    }
}

// --- INBOX REFRESH LOGIC ---
async function fetchInquiries() {
    const inbox = document.getElementById('inbox-list');
    inbox.innerHTML = '<p>Refreshing inbox...</p>';

    const { data: messages, error } = await _supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) { inbox.innerHTML = "Error loading inquiries."; return; }

    inbox.innerHTML = '';
    messages.forEach(msg => {
        const date = new Date(msg.created_at).toLocaleString();
        const div = document.createElement('div');
        div.className = "inquiry-card";
        div.innerHTML = `
            <div style="color: #667781; font-size: 0.85rem;">${date}</div>
            <div style="font-weight: bold; color: var(--primary); margin: 5px 0;">From: ${msg.sender}</div>
            <div style="color: #111b21;">${msg.message}</div>
        `;
        inbox.appendChild(div);
    });
}

function handleLogout() { _supabase.auth.signOut(); location.reload(); }