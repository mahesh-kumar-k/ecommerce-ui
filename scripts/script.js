window.onload = function() {
    addPageHeader();
};

// function checkUserExists() {
//     var cookieList = (document.cookie).split(';');
//     var cookiesMap =  new Map();
//     for(var i=0; i<cookieList.length; i++) {
//         cookiesMap.set(cookieList[i].split('=')[0], cookieList[i].split('=')[1]);
//     }
//     if(! cookiesMap.has("UserId")) {
//         window.alert("Please login first.");
//         window.location.href = "index.html";  
//     }
// }

function addPageHeader() {
    var header = document.getElementById("pageHeader");
    header.innerHTML = "<nav style=\"background-color:blue\" class=\"navbar  navbar-fixed-top\"><div class=\"container\"><h3 class=\"navbar-brand\" ><a href=\"products.html\"><b style=\"color:yellow\">E-Commerce Website</b></a></h3>    <span class=\"ml-auto\"><button onclick=\"loadCartsPage()\">🛒</button>&emsp;<button onclick=\"loadMyCartsPage()\">My carts</button>&emsp;<button onclick=\"loadOrdersPage()\">My Orders</button></span></div></nav>";
}

function loadCartsPage() {
    window.location.href = "cart.html";
}

function loadMyCartsPage() {
    window.location.href = 'mycarts.html';
}

function loadOrdersPage() {
    window.location.href = "orders.html";
}


function loadProductsPaage() {
    window.location.href = "products.html";
}