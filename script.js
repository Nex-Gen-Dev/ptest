function addOption() {
    const container = document.getElementById('optionsList');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'poll-option';
    input.placeholder = 'New Option';
    input.style.marginTop = "10px";
    container.appendChild(input);
}

// Function to handle form "submission" (visual only for now)
document.querySelector('.poll-form button.btn').addEventListener('click', function() {
    const title = document.getElementById('pollTitle').value;
    if(title) {
        alert("Poll '" + title + "' has been created (Draft Mode)!");
    } else {
        alert("Please enter a Poll Title.");
    }
});
