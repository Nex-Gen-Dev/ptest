// Initializing Supabase (Main Site)
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = "Guest"; // Global variable for the sender's name

function enterSite() {
    const user = document.getElementById('username-input').value;
    if(!user) { alert("Please enter your name"); return; }
    currentUser = user; // Save the name for the database
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    switchChat('ai'); 
}

// ... (keep the siteData and switchChat functions from before) ...

// Updated Send Message Logic to save to Supabase
document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const msgArea = document.getElementById('message-area');
    
    if(input.value.trim() !== "") {
        const userMessage = input.value;

        // 1. Add User Message to UI
        const uMsg = document.createElement('div');
        uMsg.className = "msg out";
        uMsg.innerText = userMessage;
        msgArea.appendChild(uMsg);

        // 2. SAVE TO SUPABASE (This is the new part!)
        const { error } = await _supabase
            .from('inquiries')
            .insert([{ sender: currentUser, message: userMessage }]);

        if (error) console.log("Database Error:", error.message);

        // 3. Bot Response
        setTimeout(() => {
            const bMsg = document.createElement('div');
            bMsg.className = "msg in";
            bMsg.innerText = "Chaim's team has received your message. We will reach out shortly!";
            msgArea.appendChild(bMsg);
            msgArea.scrollTop = msgArea.scrollHeight;
        }, 800);

        input.value = "";
        msgArea.scrollTop = msgArea.scrollHeight;
    }
});