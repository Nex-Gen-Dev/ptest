const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Existing Function to Post Content
async function saveToSupabase() {
    // ... (Keep your existing saveToSupabase code here) ...
}

// 2. NEW: Function to Fetch AI Inquiries
async function fetchInquiries() {
    const inbox = document.getElementById('inbox-list');
    
    const { data: messages, error } = await _supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first

    if (error) {
        inbox.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
        return;
    }

    if (messages.length === 0) {
        inbox.innerHTML = `<p style="text-align:center">No messages yet.</p>`;
        return;
    }

    inbox.innerHTML = ''; // Clear the "Loading" text
    messages.forEach(msg => {
        const time = new Date(msg.created_at).toLocaleString();
        const msgDiv = document.createElement('div');
        msgDiv.style = "background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #00a884;";
        msgDiv.innerHTML = `
            <div style="display:flex; justify-content:between; font-size:0.8rem; color:#888;">
                <strong>From: ${msg.sender}</strong>
                <span style="margin-left:auto">${time}</span>
            </div>
            <p style="margin-top:5px; color:#333;">${msg.message}</p>
        `;
        inbox.appendChild(msgDiv);
    });
}

// Automatically load messages when you open the admin page
window.onload = fetchInquiries;