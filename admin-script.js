// Initializing Supabase
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function saveToSupabase() {
    const cat = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const status = document.getElementById('status-msg');

    status.innerText = "Processing...";
    status.style.color = "blue";

    // This sends the data to your 'content' table in Supabase
    const { data, error } = await _supabase
        .from('content')
        .insert([{ 
            category: cat, 
            title: title, 
            body: body,
            created_at: new Date() 
        }]);

    if (error) {
        status.innerText = "Error: " + error.message;
        status.style.color = "red";
    } else {
        status.innerText = "Successfully posted to the website!";
        status.style.color = "green";
        // Clear the form
        document.getElementById('post-title').value = "";
        document.getElementById('post-body').value = "";
    }
}