// Ensure these are only declared ONCE at the very top
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. SPLASH TRANSITION
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash');
        const login = document.getElementById('login-screen');
        if (splash) splash.style.display = 'none';
        if (login) {
            login.classList.remove('hidden');
            login.style.display = 'flex';
        }
    }, 2500);
});

// 2. LOGIN LOGIC
let currentUser = "Guest";
function enterSite() {
    const nameInput = document.getElementById('username-input');
    if (nameInput && nameInput.value.trim() !== "") {
        currentUser = nameInput.value;
        document.getElementById('login-screen').style.display = 'none';
        const app = document.getElementById('app');
        app.classList.remove('hidden');
        app.style.display = 'flex';
        switchChat('ai');
    } else {
        alert("Please enter your name.");
    }
}

async function switchChat(key) {
    const msgArea = document.getElementById('message-area');
    document.getElementById('active-chat-title').innerText = siteData[key].title;
    
    msgArea.innerHTML = '<div class="loading-spinner"></div>'; // Add a nice CSS spinner later

    // 1. FETCH DATA
    const { data: items, error } = await _supabase.from(key === 'polls' ? 'polls' : 'content').select('*');

    msgArea.innerHTML = '';

    if (items && items.length > 0) {
        items.forEach(item => {
            const div = document.createElement('div');
            
            if (key === 'polls') {
                // --- BEAUTIFUL POLL CARD ---
                div.className = "poll-card-modern";
                const opts = item.options.split(','); // Split "Yes,No,Maybe" into an array
                
                div.innerHTML = `
                    ${item.image_url ? `<img src="${item.image_url}" class="poll-img">` : ''}
                    <div class="poll-content">
                        <h4>${item.question}</h4>
                        <div class="poll-options-grid">
                            ${opts.map(opt => `<button class="poll-vote-btn" onclick="castVote(this)">${opt.trim()}</button>`).join('')}
                        </div>
                    </div>
                `;
            } else {
                // --- REGULAR CHAT MESSAGE ---
                div.className = "msg in";
                div.innerHTML = `<strong>${item.title}</strong><br>${item.body}`;
            }
            msgArea.appendChild(div);
        });
    } else {
        msgArea.innerHTML = `<p class='empty-state'>No ${key} available yet.</p>`;
    }
}

// THE CELEBRATION FUNCTION
function castVote(btn) {
    // 1. Visual Feedback
    btn.style.background = "#00a884";
    btn.style.color = "white";
    btn.innerHTML = "✓ Voted";

    // 2. CONFETTI BURST (The 2026 Touch)
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00a884', '#ffffff', '#25d366']
    });

    // 3. Disable other buttons in the same card
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);
}
// 4. AI SEND BUTTON (THE FIX)
document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    const activeTitle = document.getElementById('active-chat-title').innerText;
    
    if(input.value.trim() !== "" && activeTitle === "Business AI Bot") {
        const userMsg = input.value;
        
        // Show user message in UI
        const uDiv = document.createElement('div');
        uDiv.className = "msg out";
        uDiv.innerText = userMsg;
        msgArea.appendChild(uDiv);

        // CLEAR INPUT
        input.value = "";

        // SEND TO SUPABASE
        const { error } = await _supabase
            .from('inquiries')
            .insert([{ sender: currentUser, message: userMsg }]);

        if (error) {
            console.error("DATABASE ERROR:", error.message);
        } else {
            // Show bot response only if save worked
            setTimeout(() => {
                const bDiv = document.createElement('div');
                bDiv.className = "msg in";
                bDiv.innerHTML = `<strong>Bot:</strong> Got it, ${currentUser}. Chaim's team will review this!`;
                msgArea.appendChild(bDiv);
                msgArea.scrollTop = msgArea.scrollHeight;
            }, 800);
        }
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});