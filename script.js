// --- PASTE YOUR KEYS HERE ---
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
// ----------------------------

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentUser = "Guest";

function enterSite() {
    const user = document.getElementById('username-input').value;
    if(!user) { alert("Please enter your name"); return; }
    currentUser = user;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    switchChat('ai'); 
}

// Logic for switching chats and loading content
const siteData = { /* ... previously provided site data ... */ };

async function switchChat(key) {
    const chat = siteData[key];
    const msgArea = document.getElementById('message-area');
    document.getElementById('active-chat-title').innerText = chat.title;
    
    msgArea.innerHTML = '<p style="text-align:center; color:gray;">Loading chat...</p>';

    // FETCH FROM SUPABASE: This gets your vlogs/blogs dynamically!
    let { data: posts } = await _supabase.from('content').select('*').eq('category', key);
    
    msgArea.innerHTML = '';
    // Show static welcome messages first
    chat.messages.forEach(m => {
        const div = document.createElement('div');
        div.className = `msg ${m.type}`;
        div.innerHTML = m.html || m.text;
        msgArea.appendChild(div);
    });

    // Then show your new posts from the Back Office
    if(posts) {
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = "msg in";
            div.innerHTML = `<strong>${post.title}</strong><br>${post.body}`;
            msgArea.appendChild(div);
        });
    }
}

// AI Send Button: Saves to "inquiries" table
document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    
    if(input.value.trim() !== "") {
        const userMessage = input.value;
        const uMsg = document.createElement('div');
        uMsg.className = "msg out";
        uMsg.innerText = userMessage;
        msgArea.appendChild(uMsg);

        // SAVE INQUIRY TO DATABASE
        await _supabase.from('inquiries').insert([{ sender: currentUser, message: userMessage }]);

        setTimeout(() => {
            const bMsg = document.createElement('div');
            bMsg.className = "msg in";
            bMsg.innerText = "Thanks " + currentUser + "! Chaim's team has received your message.";
            msgArea.appendChild(bMsg);
            msgArea.scrollTop = msgArea.scrollHeight;
        }, 800);

        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});
