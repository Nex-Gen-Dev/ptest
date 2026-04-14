// --- AUTO-CONFIGURED SUPABASE CONNECTION ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. THE SPLASH TRANSITION ---
// This hides the splash screen and shows the login no matter what.
function unlockSite() {
    const splash = document.getElementById('splash');
    const login = document.getElementById('login-screen');
    
    if (splash) splash.style.display = 'none';
    if (login) {
        login.classList.remove('hidden');
        login.style.display = 'flex';
    }
}
setTimeout(unlockSite, 2500); // 2.5 second timer

// --- 2. LOGIN LOGIC ---
let currentUser = "Guest";
function enterSite() {
    const nameInput = document.getElementById('username-input');
    if (nameInput && nameInput.value.trim() !== "") {
        currentUser = nameInput.value;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('app').style.display = 'flex';
        switchChat('ai'); // Start at the AI Chat
    } else {
        alert("Please enter your name.");
    }
}

// --- 3. DYNAMIC CHAT SWITCHER ---
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
    
    // Update Header
    document.getElementById('active-chat-title').innerText = chat.title;
    const avatar = document.getElementById('current-avatar');
    avatar.className = `chat-avatar-small ${chat.color}`;
    avatar.innerHTML = `<i class="fas ${chat.icon}"></i>`;

    msgArea.innerHTML = '<p style="text-align:center; padding:20px; color:gray;">Loading updates...</p>';

    // Fetch Content from Supabase
    try {
        let { data: posts } = await _supabase.from('content').select('*').eq('category', key);
        
        msgArea.innerHTML = ''; // Clear loading text

        if (posts && posts.length > 0) {
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = "msg in";
                // If it's a vlog, embed the YouTube player
                if (key === 'vlogs' && post.body.includes('youtube.com')) {
                    const vidId = post.body.split('v=')[1];
                    div.innerHTML = `<strong>${post.title}</strong><br><iframe class="vlog-frame" height="200" src="https://www.youtube.com/embed/${vidId}" frameborder="0" style="width:100%; border-radius:8px; margin-top:10px;"></iframe>`;
                } else {
                    div.innerHTML = `<strong>${post.title}</strong><br>${post.body}`;
                }
                msgArea.appendChild(div);
            });
        } else {
            msgArea.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">No messages in this chat yet.</p>';
        }
    } catch (e) {
        msgArea.innerHTML = '<p style="color:red; text-align:center;">Failed to load messages.</p>';
    }
    
    msgArea.scrollTop = msgArea.scrollHeight;
}

// --- 4. AI CHAT INTERACTION ---
document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    
    if(input.value.trim() !== "") {
        const userMsg = input.value;
        const uDiv = document.createElement('div');
        uDiv.className = "msg out";
        uDiv.innerText = userMsg;
        msgArea.appendChild(uDiv);

        // Save Inquiry to Supabase
        await _supabase.from('inquiries').insert([{ sender: currentUser, message: userMsg }]);

        setTimeout(() => {
            const bDiv = document.createElement('div');
            bDiv.className = "msg in";
            bDiv.innerText = "Hi " + currentUser + "! Chaim's team has received your message. We'll be in touch!";
            msgArea.appendChild(bDiv);
            msgArea.scrollTop = msgArea.scrollHeight;
        }, 1000);

        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});