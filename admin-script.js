const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showTab(id, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-title').innerText = el.innerText;
}

async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message); else document.getElementById('login-box').classList.add('hidden');
}

async function saveContent() {
    const category = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const { error } = await _supabase.from('content').insert([{ category, title, body }]);
    if (error) alert(error.message); else { alert("Published!"); location.reload(); }
}

async function saveEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;
    const { error } = await _supabase.from('events').insert([{ title, date, location }]);
    if (error) alert(error.message); else { alert("Event Scheduled!"); location.reload(); }
}

async function savePoll() {
    const question = document.getElementById('poll-question').value;
    const image_url = document.getElementById('poll-image').value;
    const options = document.getElementById('poll-options').value;
    const { error } = await _supabase.from('polls').insert([{ question, image_url, options }]);
    if (error) alert(error.message); else { alert("Poll Launched!"); location.reload(); }
}

async function fetchInquiries() {
    const list = document.getElementById('inbox-list');
    list.innerHTML = 'Refreshing...';
    const { data, error } = await _supabase.from('inquiries').select('*').order('created_at', {ascending: false});
    if (error) return list.innerHTML = "Error.";
    list.innerHTML = '';
    data.forEach(m => {
        const d = document.createElement('div');
        d.className = "inquiry-item";
        d.innerHTML = `<strong>${m.sender}:</strong> ${m.message} <br> <small>${new Date(m.created_at).toLocaleString()}</small>`;
        list.appendChild(d);
    });
}