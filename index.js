const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');

// parse body json 
app.use(express.json());

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/


/* 
  - Validation to check if the file exists
  - If it doesn't exist, it will create a new file by reloading.
  - If it exists, it will return the file to the client.
*/

let createFile = (filename) => {
  fs.open(filename,'r',function(err){
    if (err) {
      fs.appendFile('home.html', '<h1>Welcome to ExpressJs Tutorial</h1>', function(err) {
          if(err) {
              console.log(err);
          }
          console.log("The file was saved!");
      });
    } else {
      console.log("The file exists!");
    }
  });
}

router.get('/', (req, res) => {
  createFile('home.html');
  res.sendFile(__dirname + '/home.html');
})


router.get('/home', (req,res) => {
  res.send('This is home router');
});

/*
- Return all details from user.json file to client as JSON format
*/

router.get('/user', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) =>  {
    if (err) throw err;
    res.send(JSON.parse(data));
  })
})


/*
- Modify /login router to accept username and password as query string parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/

router.get('/login', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) throw err;
    let user = JSON.parse(data);
    if (req.query.username == user.username && req.query.password == user.password) {
      res.send({
        status: true,
        message: 'User is valid'
      });
    } else if (req.query.username != user.username) {
      res.send({
        status: false,
        message: 'Username is invalid'
      });
    } else if (req.query.password != user.password) {
      res.send({
        status: false,
        message: "Password is invalid"
      })
    }
  })
})


// router.get('/login', (req,res) => {
//   res.send('This is login router');
// });

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req,res) => {
  res.send(`<b>${req.query.username} sucessfully logout.</b>`);
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));