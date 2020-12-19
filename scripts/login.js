function loginUser() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var bodyDisplay = document.getElementById("main").style.display;
  var loadingDisplay = document.getElementById("loading").style.display;
   
  bodyDisplay = "none";
  loadingDisplay = "block";
  axios.get('https://localhost:5001/api/users/login/',
    {
      params: { 
        username: username,
        password: password
      }
    }).then((response) => {
      loadingDisplay = "none";
      bodyDisplay = "block";
      if (response.status === 200) {
        var d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "UserId = " + response.data + ";" + expires + ";path=/;Secure=true";
       
        window.location.href = "products.html";
      } 
    }).catch(error => {
      loadingDisplay = "none";
      bodyDisplay = "block";
      if(error.response.status == 404) {
        alert(error.response.data.message);
      }
    });
}

/*axios.get('http://jsonplaceholder.typicode.com/todos')
  .then(function (response) {
    resultElement.innerHTML = generateSuccessHTMLOutput(response);
  })
  .catch(function (error) {
    resultElement.innerHTML = generateErrorHTMLOutput(error);
  }); */
