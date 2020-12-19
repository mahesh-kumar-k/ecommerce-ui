function saveCart() {
    var productString = retrieveItemsFromLocalStorage();
    var userId = getCookie("UserId");
    console.log(productString);
    console.log(userId);
    const api = axios.create({ baseURL: 'https://localhost:5001/' });
    api.post('/api/carts', {
        userId: userId,
        productData: productString,
        isOrderPlaced = 0,
        orderId = 0,
    }).then(res => {
        console.log(res)
        window.alert("Cart saved.");
    }).catch(error => {
        console.log(error)
        window.alert("Error saving cart!");
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}