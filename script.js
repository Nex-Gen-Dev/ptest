// --- CONFIGURATION ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. SPLASH TO LOGIN TRANSITION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portal Initialized...");
    setTimeout(() => {
        const splash = document.getElementById('splash');
        const login = document.getElementById('login-screen');
        if (splash) splash.style.display = 'none';
        if (login) {
            login.classList.remove('hidden');
            login.style.display = 'flex';
        }
    }, 2500); // 2.5 Second Loading Screen
});

// --- 2. LOGIN LOGIC ---
let currentUser = "Guest";
function enterSite() {
    const nameInput = document.getElementById('username-input');
    if (nameInput && nameInput.value.trim() !== "") {
        currentUser = nameInput.value;
        document.getElementById('login-screen').style.display = 'none';
        const app = document.getElementById('app');
        app.classList.remove('hidden');
        app.style.display = 'flex';
        switchChat('ai'); // Start with AI Bot
    } else {
        alert("Please enter your name to unlock the desktop.");
    }
}

// --- 3. CHAT & CONTENT FETCHING ---
const siteData = {
    ai: { title: "Business AI Bot", color: "bot-color", icon: "fa-robot" },
    vlogs: { title: "Chaim's Vlogs", color: "vlogs-color", icon: "fa-video" },
    blogs: { title: "The Blog Feed", color: "blogs-color", icon: "fa-newspaper" },
    promotions: { title: "Promotions & Ads", color: "promo-color", icon: "fa-bullhorn" },
    polls: { title: "Live Polls", color: "polls-color", icon: "fa-poll-h" },
    stores: { title: "Store Finder", color: "stores-color", icon: "fa-map-marker-alt" }
};

async function switchChat(key) {
    const chat = siteData[key];
    const msgArea = document.getElementById('message-area');
    
    // UI Updates
    document.getElementById('active-chat-title').innerText = chat.title;
    const avatar = document.getElementById('current-avatar');
    avatar.className = `chat-avatar-small ${chat.color}`;
    avatar.innerHTML = `<i class="fas ${chat.icon}"></i>`;

    msgArea.innerHTML = '<p style="text-align:center; padding:20px; color:gray;">Checking for updates...</p>';

    // Fetch from Supabase "content" table
    try {
        let { data: posts, error } = await _supabase.from('content').select('*').eq('category', key);
        msgArea.innerHTML = ''; 

        if (posts && posts.length > 0) {
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = "msg in";
                // Enhanced Vlog embedding
                if (key === 'vlogs' && post.body.includes('youtube.com')) {
                    const vidId = post.body.split('v=')[1]?.split('&')[0];
                    div.innerHTML = `<strong>${post.title}</strong><br><iframe class="vlog-frame" height="200" src="https://www.youtube.com/embed/${vidId}" frameborder="0" style="width:100%; border-radius:8px; margin-top:10px;" allowfullscreen></iframe>`;
                } else {
                    div.innerHTML = `<strong>${post.title}</strong><br>${post.body}`;
                }
                msgArea.appendChild(div);
            });
        } else {
            msgArea.innerHTML = `<p style="text-align:center; color:gray; padding:20px;">No ${key} posted yet.</p>`;
        }
    } catch (e) {
        console.error(e);
    }
    msgArea.scrollTop = msgArea.scrollHeight;
}

// --- 4. AI INQUIRY SENDER ---
document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    const activeTitle = document.getElementById('active-chat-title').innerText;
    
    if(input.value.trim() !== "") {
        const userMsg = input.value;
        const uDiv = document.createElement('div');
        uDiv.className = "msg out";
        uDiv.innerText = userMsg;
        msgArea.appendChild(uDiv);

        // Save to "inquiries" table
        if (activeTitle === "Business AI Bot") {
            await _supabase.from('inquiries').insert([{ sender: currentUser, message: userMsg }]);
            
            setTimeout(() => {
                const bDiv = document.createElement('div');
                bDiv.className = "msg in";
                bDiv.innerHTML = `<strong>Bot:</strong> Got it, ${currentUser}. Chaim's team will review this shortly!`;
                msgArea.appendChild(bDiv);
                msgArea.scrollTop = msgArea.scrollHeight;
            }, 1000);
        }

        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});