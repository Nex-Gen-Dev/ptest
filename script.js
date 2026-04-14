// 1. Splash & Login Transition
window.onload = () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 2500);
};

function enterSite() {
    const user = document.getElementById('username-input').value;
    if(!user) { alert("Please enter your name to access Chaim's Portal."); return; }
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    switchChat('ai'); // Default start
}

// 2. Full Website Content Data
const siteData = {
    promotions: {
        title: "Promotions & Ads",
        color: "promo-color",
        icon: "fa-bullhorn",
        messages: [
            { type: "in", text: "🔥 Exclusive Offers for Chaim's Community!" },
            { type: "in", html: '<div class="promo-box"><img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=300&q=80" class="promo-img"><strong>Partner Brand Deal</strong><br>Use code CHAIM20 for 20% off our latest merch drop!</div>' },
            { type: "in", text: "Interested in advertising here? Message the AI bot for rates." }
        ]
    },
    ai: {
        title: "Business AI Bot",
        color: "bot-color",
        icon: "fa-robot",
        messages: [
            { type: "in", text: "Hello! I am Chaim's Business Intelligence Assistant." },
            { type: "in", text: "I can help with:\n- Booking inquiries\n- Ad pricing\n- Business collaborations\n\nHow can I help you today?" }
        ]
    },
    vlogs: {
        title: "Chaim's Vlogs",
        color: "vlogs-color",
        icon: "fa-video",
        messages: [
            { type: "in", text: "Latest Upload: My trip to the main HQ." },
            { type: "in", html: '<iframe class="vlog-frame" height="200" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>' }
        ]
    },
    blogs: {
        title: "The Blog Feed",
        color: "blogs-color",
        icon: "fa-newspaper",
        messages: [
            { type: "in", text: "Article: Why Digital Presence is Everything in 2026." },
            { type: "in", text: "In today's world, your website is your handshake. Read the full analysis at our main blog portal link below." }
        ]
    },
    polls: {
        title: "Live Polls",
        color: "polls-color",
        icon: "fa-poll-h",
        messages: [
            { type: "in", text: "Your opinion matters! Please vote below:" },
            { type: "in", html: '<div class="promo-box"><strong>What content do you want more of?</strong><br><br><input type="radio" name="poll"> Daily Vlogs<br><input type="radio" name="poll"> Business Tips<br><br><button class="login-btn">Submit Vote</button></div>' }
        ]
    },
    stores: {
        title: "Store Finder",
        color: "stores-color",
        icon: "fa-map-marker-alt",
        messages: [
            { type: "in", text: "Find a Chaim Perlowitz authorized location near you:" },
            { type: "in", text: "📍 Flagship NYC: 123 Broadway, NY\n📍 London Hub: 456 Piccadilly St.\n📍 Tel Aviv: 789 Herzl St." }
        ]
    }
};

// 3. Navigation Switcher
function switchChat(key) {
    const chat = siteData[key];
    const msgArea = document.getElementById('message-area');
    
    // Update Header UI
    document.getElementById('active-chat-title').innerText = chat.title;
    const avatar = document.getElementById('current-avatar');
    avatar.className = `chat-avatar-small ${chat.color}`;
    avatar.innerHTML = `<i class="fas ${chat.icon}"></i>`;

    // Clear and Inject Content
    msgArea.innerHTML = '';
    chat.messages.forEach(m => {
        const div = document.createElement('div');
        div.className = `msg ${m.type}`;
        div.innerHTML = m.html || m.text.replace(/\n/g, '<br>');
        msgArea.appendChild(div);
    });

    // Sidebar highlight
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
        // If the chat item text matches the key, highlight it
        if(item.onclick.toString().includes(key)) item.classList.add('active');
    });

    msgArea.scrollTop = msgArea.scrollHeight;
}

// 4. AI Chat Interaction
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    
    if(input.value.trim() !== "") {
        // User Message
        const uMsg = document.createElement('div');
        uMsg.className = "msg out";
        uMsg.innerText = input.value;
        msgArea.appendChild(uMsg);

        // Simple Bot Response
        setTimeout(() => {
            const bMsg = document.createElement('div');
            bMsg.className = "msg in";
            bMsg.innerText = "Chaim's team has logged your inquiry: '" + input.value + "'. We will reach out shortly.";
            msgArea.appendChild(bMsg);
            msgArea.scrollTop = msgArea.scrollHeight;
        }, 1000);

        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});
