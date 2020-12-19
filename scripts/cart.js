const IMAGE = "image";
const NAME = "name";
const PRICE = "price";
const PRODUCTCOUNT = "productcount";

function saveItemToLocalStorage(productString) {
    productcount = Number(localStorage.getItem(PRODUCTCOUNT));
    productcount++;
    localStorage.setItem(productcount.toString(), productString);
    localStorage.setItem(PRODUCTCOUNT, productcount);
}

function retrieveItemsFromLocalStorage(forDb = false) {
    productcount = Number(localStorage.getItem(PRODUCTCOUNT));
    if (forDb) {
        var reqStr = "";
        for (var i = 1; i <= productcount; i++) {
            reqStr += localStorage.getItem(i.toString()) + "###";
        }
        return reqStr;
    }
    var products = [];
    for (var i = 1; i <= productcount; i++) {
        products[i] = localStorage.getItem(i.toString());
    }
    return products;
}

function submitMobile() {
    var mobileColor = document.getElementById("color").value;
    var mobileString = "mobile-phone;" + "images/mobilephone.jpg;" + "Mobile Phone;" + "15000" + ";Color:" + mobileColor;
    saveItemToLocalStorage(mobileString);
    showAlert();
}

function submitShoes() {
    var shoeColor = document.getElementById("shoecolor").value;
    var values = document.getElementsByName("shoesize");
    var shoeSize = 0;
    for (var i = 0; i < values.length; i++) {
        if (values[i].checked) {
            shoeSize = values[i].value;
            break;
        }
    }
    var shoeString = "shoes;" + "images/shoes.png;" + "Shoes;" + "3000" + ";Color:" + shoeColor + ";Size:" + shoeSize;
    saveItemToLocalStorage(shoeString);
    showAlert();
}

function submitJacket() {
    var jacketColor = document.getElementById("jacketcolor").value;
    var values = document.getElementsByName("jackettype");
    var jacketType = "";
    for (var i = 0; i < values.length; i++) {
        if (values[i].checked) {
            jacketType = values[i].value;
            break;
        }
    }
    var jacketString = "jacket;" + "images/jacket.png;" + "Jacket;" + "2000" + ";Color:" + jacketColor + ";Type:" + jacketType;
    saveItemToLocalStorage(jacketString);
    showAlert();
}

function displayCartProducts() {
    var products = retrieveItemsFromLocalStorage();
    var productDiv = document.getElementById("products");
    if (products == null || products.length == 0) {
        productDiv.innerHTML = "<h4 style=\"text-align:center; padding: 20% 0;\">No products in your cart</h4>";
        document.getElementById("saveButtons").style.display = "none";
        return;
    }
    var totalPrice = { price: 0 };
    var reqHtml = getRequiredProductsHtml(products, totalPrice);
    reqHtml += "<h4 style=\"text-align:right;margin-right:80px;\">Total Price : Rs.<span id=\"priceTotal\">" + totalPrice.price.toString() + "</span></h4><hr>";
    productDiv.innerHTML = reqHtml;
}

function getRequiredProductsHtml(products, total = { price: 0 }) {
    var reqHtml = "<hr>";
    for (var i = 0; i < products.length; i++) {
        var productString = products[i];
        if (productString == null || productString == "") {
            continue;
        }
        var details = productString.split(';');
        reqHtml += "<div class=\"row\">\
        <div class=\"col-md-4 text-center\">\
          <div class=\"thumbnail\">\
            <div class=\"caption\">\
              <img src= " + details[1] + " height=180px weight=200px alt=\"mobilephone\"><br /><br />\
              <h3><a href=" + details[0] + "-details.html" + "class=\"btn btn-primary\" role=\"button\">" + details[2] + "</a></h3>\
            </div>\
          </div>\
        </div>\
        <div style=\"margin-top : 65px\" class=\"col-md-4 text-center\">"
            + getDetailsHtml(details) +
            "</div>\
        <div style=\"margin-top : 65px\" class=\"col-md-4 text-center\">\
          <h5>Rs. " + details[3] + "</h5>\
        </div>\
      </div>" + "<hr>";
        total.price += Number(details[3]);
    }
    return reqHtml;
}

function getDetailsHtml(details) {
    var res = "";
    for (var i = 4; i < details.length; i++) {
        var features = details[i].split(":");
        res += "<p><strong>" + features[0] + "</strong> : " + features[1] + "</p>";
    }
    return res;
}

function showAlert() {
    window.alert("Item added to your cart successfully.")
}

function saveCart() {
    var productString = retrieveItemsFromLocalStorage(true);
    var userId = Number(getCookie("UserId"));
    axios.post('https://localhost:5001/api/carts', {
        userId: userId,
        productData: productString,
        isOrderPlaced: false,
        orderId: 0,
    }).then(res => {
        window.alert("Cart saved.");
        localStorage.clear();
        window.location.href = 'products.html';
    }).catch(error => {
        window.alert("Error saving cart!");
    });
}

function displayMyCarts() {
    var userId = Number(getCookie("UserId"));
    var cartListDiv = document.getElementById("cartsList");
    var infoText = document.getElementById("infoText");
    axios.get('https://localhost:5001/api/carts/user/' + userId.toString()
    ).then(response => {
        var carts = response.data;
        if (carts == null || carts.length == 0) {
            infoText.innerText = "You do not have any carts.";
            return;
        }
        var reqCarts = new Array();
        carts.forEach(cart => {
            reqCarts.push(cart.productData.split("###"));
        });
        var reqHtml = "";
        var totalPrice;
        for (var i = 0; i < reqCarts.length; i++) {
            totalPrice = { price: 0 };
            reqHtml += "<h4 style=\"padding-left: 50px\">Cart : " + (i + 1).toString() + "</h4>";
            reqHtml += getRequiredProductsHtml(reqCarts[i], totalPrice);
            reqHtml += "<h4 style=\"text-align:right;margin-right:80px;\">Total Price : Rs." + totalPrice.price + "</h4>";
            reqHtml += "<button style=\"margin-left:630px\" class=\"btn btn-success text-center\" onclick=\"showPaymentOptions(" + i + "," + carts[i].id + "," + userId + "," + totalPrice.price + ")\">Place order</button><div id=\"paymentoptions" + i.toString() + "\"></div>";
            reqHtml += "<hr>";
        }
        cartListDiv.innerHTML = reqHtml;
    }).catch(err => {
        if (err?.response?.status == 404) {
            infoText.innerText = err.response.data.message;
        } else {
            infoText.innerText = "Some error occurred while retrieving your carts please try again!";
        }
    });
}

function displayMyOrders() {
    
}

function showPaymentOptions(i, cartId, userId, totalPrice) {
    var paymentOptionsHtml = "<div class=\"container\" style=\"margin:50px 35%;\">\
    <h4>Select your payment method</h4>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"upi\"> UPI (5% discount)</label><br>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"debit\"> Debit Card (10% discount)</label><br>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"credit\"> Credit Card (15% discount)</label><br>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"COD\"> Cash on Delivery</label><br>\
    <button style=\"margin: 0 auto\" class=\"btn btn-success text-center\" onclick=\"placeOrder("+ cartId + "," + userId + "," + totalPrice + ")\">Submit</button></div>";
    var id = "paymentoptions" + i.toString();
    document.getElementById(id).innerHTML = paymentOptionsHtml;
}

function placeOrder(cartId, userId, totalPrice) {
    var paymenttype = getPaymentType("paymenttype");
    var discount = getDiscount(paymenttype, totalPrice);
    axios.post('https://localhost:5001/api/orders/', {
        order: {
            userId: userId,
            totalPrice: totalPrice,
            discount: discount,
            paymentType: paymenttype
        },
        cartId: cartId
    }).then(response => {
        orderSuccess(paymenttype, discount);
    }).catch(err => {
        orderFailure(err);
    });
}

function showPaymentOptions() {
    var paymentOptionsHtml = "<div class=\"container\" style=\"margin:50px 35%;\">\
    <h4>Select your payment method</h4>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"upi\"> UPI (5% discount)</label><br>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"debit\"> Debit Card (10% discount)</label><br>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"credit\"> Credit Card (15% discount)</label><br>\
    <label><input type=\"radio\" name=\"paymenttype\" value=\"COD\"> Cash on Delivery</label><br>\
    <button style=\"margin: 0 auto\" class=\"btn btn-success text-center\" onclick=\"saveCartAndPlaceOrder()\">Submit</button></div>";
    document.getElementById("paymentOptions").innerHTML = paymentOptionsHtml;
}

function saveCartAndPlaceOrder() {
    var productString = retrieveItemsFromLocalStorage(true);
    var userId = Number(getCookie("UserId"));
    var totalPrice = Number(document.getElementById("priceTotal").innerHTML);
    var paymentType = getPaymentType("paymenttype");
    var discount = getDiscount(paymentType, totalPrice);
    axios.post("https://localhost:5001/api/orders/save-cart/", {
        order: {
            userId: userId,
            totalPrice: totalPrice,
            paymentType: paymentType,
            discount: discount,
        },
        cart: {
            userId: userId,
            productData: productString,
            isOrderPlaced: false,
            orderId: 0,
        }
    }).then(_ => {
        localStorage.clear();
        orderSuccess(paymentType, discount);
    }).catch(err => {
        orderFailure(err);
    })
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

function getDiscount(paymenttype, totalPrice) {
    if (paymenttype == "upi")
        return totalPrice * 0.05;
    else if (paymenttype == "debit")
        return totalPrice * 0.1;
    else if (paymenttype == "credit")
        return totalPrice * 0.15;
    else
        return 0;
}

function getPaymentType(paymentTypeId) {
    var options = document.getElementsByName(paymentTypeId);
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return options[i].value;
        }
    }
}

function orderSuccess(paymenttype, discount) {
    var message = "Hurray! Your order has been placed. ";
    message += (paymenttype == "COD" ? "" : ("You saved Rs." + discount + " on your order."));
    window.alert(message);
    window.location.href = 'products.html';
}

function orderFailure(err) {
    if (err?.response?.status == 404) {
        window.alert(err.response.message);
    } else {
        window.alert("Oops! some error occurred while placing your order.");
    }
}