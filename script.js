const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentTab = 'ai';
let currentUser = "Guest";

// 1. App Startup
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('login-screen').style.display = 'flex';
    }, 2000);
});

function enterSite() {
    const name = document.getElementById('username-input').value;
    if(name.trim() === "") return alert("Please enter your name.");
    currentUser = name;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    switchTab('ai', document.querySelector('.nav-links li'));
}

// 2. Tab & Content Logic
async function switchTab(key, el) {
    currentTab = key;
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    if(el) el.classList.add('active');
    
    document.getElementById('active-title').innerText = el ? el.innerText : key.toUpperCase();
    document.getElementById('chat-footer').style.display = (key === 'ai') ? 'flex' : 'none';

    refreshContent();
}

async function refreshContent() {
    const area = document.getElementById('display-area');
    area.innerHTML = '<div style="text-align:center; padding:50px; color:gray;"><i class="fas fa-sync fa-spin"></i> Updating Portal...</div>';

    if (currentTab === 'polls') {
        const { data } = await _supabase.from('polls').select('*').order('created_at', {ascending: false});
        area.innerHTML = '';
        data?.forEach(poll => area.appendChild(renderPoll(poll)));
    } else {
        const { data } = await _supabase.from('content').select('*').eq('category', currentTab).order('created_at', {ascending: false});
        area.innerHTML = '';
        data?.forEach(item => {
            const div = document.createElement('div');
            div.className = "msg in";
            div.innerHTML = `<strong>${item.title}</strong><br>${item.body}`;
            area.appendChild(div);
        });
    }
}

// 3. 2026 Poll Rendering
function renderPoll(poll) {
    const card = document.createElement('div');
    card.className = "poll-card";
    const options = poll.options.split(',');
    
    card.innerHTML = `
        ${poll.image_url ? `<img src="${poll.image_url}" class="poll-img">` : ''}
        <div class="poll-body">
            <h3>${poll.question}</h3>
            <div class="poll-options">
                ${options.map(opt => `<button class="poll-btn" onclick="triggerVote(this)">${opt.trim()}</button>`).join('')}
            </div>
        </div>
    `;
    return card;
}

function triggerVote(btn) {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00a884', '#ffffff', '#25d366']
    });

    btn.innerHTML = "✓ Voted Successfully";
    btn.style.background = "#e7fce3";
    btn.style.borderColor = "#00a884";
    const parent = btn.closest('.poll-options');
    parent.querySelectorAll('button').forEach(b => b.disabled = true);
}

// 4. AI Chat Logic
document.getElementById('send-btn').onclick = async () => {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if(!msg) return;

    const div = document.createElement('div');
    div.className = "msg out";
    div.innerText = msg;
    document.getElementById('display-area').appendChild(div);
    input.value = "";

    await _supabase.from('inquiries').insert([{ sender: currentUser, message: msg }]);
    
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = "msg in";
        botDiv.innerText = "Chaim's team has received your message. We'll get back to you!";
        document.getElementById('display-area').appendChild(botDiv);
        document.getElementById('display-area').scrollTop = document.getElementById('display-area').scrollHeight;
    }, 1000);
};