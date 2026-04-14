// Ensure these ONLY appear at the very top, once.
const SUPABASE_URL = 'https://tijpwcarnjlrelcycyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8zO8IQeA8WTsd9fj-3k-w_HCY7JBte';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. SPLASH SCREEN TIMER
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

// 2. LOGIN TO PORTAL
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

// 3. SWITCHING CHATS
async function switchChat(key) {
    const msgArea = document.getElementById('message-area');
    document.getElementById('active-chat-title').innerText = key.toUpperCase();
    msgArea.innerHTML = '<p style="text-align:center; padding:20px; color:gray;">Loading...</p>';

    // Get vlogs/blogs from database
    const { data: posts } = await _supabase.from('content').select('*').eq('category', key);
    
    msgArea.innerHTML = ''; 
    if (posts && posts.length > 0) {
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = "msg in";
            div.innerHTML = `<strong>${post.title}</strong><br>${post.body}`;
            msgArea.appendChild(div);
        });
    } else {
        msgArea.innerHTML = `<p style="text-align:center; color:gray; padding:20px;">No ${key} found.</p>`;
    }
}

// 4. THE AI SEND BUTTON (The "Inquiry" Logic)
document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    const activeTitle = document.getElementById('active-chat-title').innerText;
    
    // Only send if it's the AI chat and not empty
    if(input.value.trim() !== "" && activeTitle === "AI") {
        const userMsg = input.value;
        
        // Show user message immediately
        const uDiv = document.createElement('div');
        uDiv.className = "msg out";
        uDiv.innerText = userMsg;
        msgArea.appendChild(uDiv);
        input.value = ""; // Clear the box

        // SEND TO SUPABASE (Table: inquiries, Columns: sender, message)
        const { error } = await _supabase
            .from('inquiries')
            .insert([{ sender: currentUser, message: userMsg }]);

        if (error) {
            console.error("DATABASE ERROR:", error.message);
        } else {
            // Only reply if it successfully saved
            setTimeout(() => {
                const bDiv = document.createElement('div');
                bDiv.className = "msg in";
                bDiv.innerHTML = `<strong>Bot:</strong> Got it, ${currentUser}! Chaim's team will see this in the back office.`;
                msgArea.appendChild(bDiv);
                msgArea.scrollTop = msgArea.scrollHeight;
            }, 800);
        }
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});
