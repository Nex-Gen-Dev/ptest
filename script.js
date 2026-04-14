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