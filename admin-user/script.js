const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 5500; 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/public'+'/add-user.html');
});


app.post('/create', (req, res) => {
    const { email, password } = req.body;

    const data = fs.readFileSync('data.json');
    const jsonData = JSON.parse(data);
    const existingUser = jsonData.users.find(user => user.email === email);
    if(existingUser){
        res.send("<script>alert('User already exists.'); window.location.href = 'new-login.html';</script>")
    }else{
    jsonData.users.push({
        email: email,
        password: password
    });
    }

    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 4));
    res.send("<script>alert('User created succesfully.'); window.location.href = 'new-login.html';</script>");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public' + '/new-login.html');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const data = fs.readFileSync('data.json');
    const jsonData = JSON.parse(data);
    const existingUser = jsonData.users.find(user => user.email === email && user.password === password);
    if (existingUser) {
        res.send("<script>alert('User login success.'); window.location.href = 'new-login.html';</script>")
    } else {
        res.send("<script>alert('Invalid Credentials or User not exist.'); window.location.href = 'new-login.html';</script>")
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
