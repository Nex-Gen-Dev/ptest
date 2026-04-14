// Store Finder Search Logic
function searchStores() {
    let input = document.getElementById('storeSearch').value.toLowerCase();
    let storeItems = document.getElementsByClassName('store-item');

    for (let i = 0; i < storeItems.length; i++) {
        let text = storeItems[i].textContent || storeItems[i].innerText;
        if (text.toLowerCase().indexOf(input) > -1) {
            storeItems[i].style.display = "";
        } else {
            storeItems[i].style.display = "none";
        }
    }
}

// Poll Option Logic
function addOption() {
    const container = document.getElementById('optionsList');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'poll-option';
    input.placeholder = 'New Option';
    input.style.marginTop = "10px";
    container.appendChild(input);
}

// Poll Creation Alert
document.querySelector('.poll-form button.btn').addEventListener('click', function(e) {
    e.preventDefault();
    const title = document.getElementById('pollTitle').value;
    if(title) {
        alert("Success! Poll '" + title + "' has been drafted for Chaim Perlowitz.");
    } else {
        alert("Please enter a Poll Title first.");
    }
});
