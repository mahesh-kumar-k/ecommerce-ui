
function signupFunction() {
    const api = axios.create({ baseURL: 'https://localhost:5001/' });
    api.post('/api/users', {
        fname : document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        username: document.getElementById("email").value,
        email: document.getElementById("email").value,
        password: document.getElementById("pwd").value
    }).then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    });
}


// to make api call
/*function makeGetRequest(path) {
    axios.get(path).then(
        (response) => {
            var result = response.data;
            console.log(result);
        },
        (error) => {
            console.log(error);
        }
    );
}
makeGetRequest('http://127.0.0.1:5000/test'); */
