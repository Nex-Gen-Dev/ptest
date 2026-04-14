// 1. Splash & Login Logic
window.onload = () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 2500);
};

function enterSite() {
    const user = document.getElementById('username-input').value;
    if(!user) { alert("Please enter your name"); return; }
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    switchChat('ai'); // Start with AI Bot
}

// 2. Content Data (All Sections)
const siteData = {
    ai: {
        title: "Business AI Bot",
        color: "bot-color",
        icon: "fa-robot",
        messages: [
            { type: "in", text: "Welcome! I'm Chaim's Business AI." },
            { type: "in", text: "How can I help you today? Ask about: \n- Ad Placements \n- Collaboration \n- General Inquiries" }
        ]
    },
    vlogs: {
        title: "Chaim's Vlogs",
        color: "vlogs-color",
        icon: "fa-video",
        messages: [
            { type: "in", text: "Check out my latest video from the NYC Studio!" },
            { type: "in", html: '<iframe class="vlog-embed" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0"></iframe>' }
        ]
    },
    blogs: {
        title: "The Blog Feed",
        color: "blogs-color",
        icon: "fa-newspaper",
        messages: [
            { type: "in", text: "New Blog Post: 'The Digital Revolution of 2026'" },
            { type: "in", text: "Modern entertainment is shifting towards interactive portals... Read more at link below." }
        ]
    },
    polls: {
        title: "Live Polls",
        color: "polls-color",
        icon: "fa-poll-h",
        messages: [
            { type: "in", text: "Help me choose the next Vlog location!" },
            { type: "in", html: '<div class="poll-box"><strong>Where should I go?</strong><br><br><input type="radio" name="p"> London<br><input type="radio" name="p"> Dubai<br><input type="radio" name="p"> Tel Aviv<br><br><button class="login-btn">Vote</button></div>' }
        ]
    },
    stores: {
        title: "Store Finder",
        color: "stores-color",
        icon: "fa-map-marker-alt",
        messages: [
            { type: "in", text: "Looking for a store?" },
            { type: "in", text: "📍 NYC Flagship: 123 Broadway\n📍 London: 789 Piccadilly" }
        ]
    }
};

// 3. Switch Chat Function
function switchChat(key) {
    const chat = siteData[key];
    const msgArea = document.getElementById('message-area');
    
    // Update Header
    document.getElementById('active-chat-title').innerText = chat.title;
    const avatar = document.getElementById('current-avatar');
    avatar.className = `chat-avatar-small ${chat.color}`;
    avatar.innerHTML = `<i class="fas ${chat.icon}"></i>`;

    // Clear and Load Messages
    msgArea.innerHTML = '';
    chat.messages.forEach(m => {
        const div = document.createElement('div');
        div.className = `msg ${m.type}`;
        div.innerHTML = m.html || m.text.replace(/\n/g, '<br>');
        msgArea.appendChild(div);
    });

    // Update Sidebar Active state
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// 4. Send Message Logic (AI Interaction)
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    
    if(input.value.trim() !== "") {
        // Add User Message
        const uMsg = document.createElement('div');
        uMsg.className = "msg out";
        uMsg.innerText = input.value;
        msgArea.appendChild(uMsg);

        // Simple Bot Response
        setTimeout(() => {
            const bMsg = document.createElement('div');
            bMsg.className = "msg in";
            bMsg.innerText = "Chaim's team has received your message regarding: '" + input.value + "'. We will get back to you soon!";
            msgArea.appendChild(bMsg);
            msgArea.scrollTop = msgArea.scrollHeight;
        }, 800);

        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});
