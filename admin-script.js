// --- AUTO-CONFIGURED SUPABASE CONNECTION ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Post Content Function
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
        status.innerText = "✅ Posted Successfully!";
        status.style.color = "green";
        document.getElementById('post-title').value = "";
        document.getElementById('post-body').value = "";
    }
}

// 2. Fetch AI Inquiries Function
async function fetchInquiries() {
    const inbox = document.getElementById('inbox-list');
    const { data: messages, error } = await _supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (messages) {
        inbox.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.style = "background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:10px; border-left:4px solid #00a884; font-size: 0.9rem;";
            div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.message}`;
            inbox.appendChild(div);
        });
    } else if (error) {
        inbox.innerHTML = '<p style="color:red;">Error loading inbox.</p>';
    }
}

window.onload = fetchInquiries;