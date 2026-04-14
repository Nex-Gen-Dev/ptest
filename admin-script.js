const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Tab Switching
function showTab(id, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-title').innerText = el.innerText;
}

// Auth Login
async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) alert("Access Denied: " + error.message);
    else {
        document.getElementById('login-box').classList.add('hidden');
        fetchInquiries();
    }
}

// Save Vlogs/Blogs
async function saveContent() {
    const category = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;

    const { error } = await _supabase.from('content').insert([{ category, title, body }]);
    if (error) alert(error.message); else { alert("Live on Portal!"); location.reload(); }
}

// Save Polls
async function savePoll() {
    const question = document.getElementById('poll-question').value;
    const image_url = document.getElementById('poll-image').value;
    const options = document.getElementById('poll-options').value;

    const { error } = await _supabase.from('polls').insert([{ question, image_url, options }]);
    if (error) alert(error.message); else { alert("Poll Launched!"); location.reload(); }
}

// Inbox Refresh
async function fetchInquiries() {
    const list = document.getElementById('inbox-list');
    list.innerHTML = 'Paging database...';

    const { data, error } = await _supabase.from('inquiries').select('*').order('created_at', {ascending: false});
    
    if (error) { list.innerHTML = "Error loading inbox."; return; }
    
    list.innerHTML = '';
    data.forEach(msg => {
        const div = document.createElement('div');
        div.className = "inquiry-item";
        div.innerHTML = `<small>${new Date(msg.created_at).toLocaleString()}</small><br>
                         <strong>${msg.sender}:</strong> ${msg.message}`;
        list.appendChild(div);
    });
}

function handleLogout() { _supabase.auth.signOut(); location.reload(); }