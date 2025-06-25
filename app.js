const express = require("express");
const bodyParser = require("body-parser");
const request = require ("request");
const https = require("https");
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
                
            }
        ]
    };

    const jsonData = JSON.stringify(data);
     
    const url = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}`;
    //const url = "https://us6.api.mailchimp.com/3.0/lists/c3ed7588a7";

    const Options = {
       method: "POST" ,
       auth: `abuali:${process.env.MAILCHIMP_API_KEY}`,
       //auth: "Abuali01:e5a9ff2314769d82d152613fef346f94-us6"   
    }

    const request = https.request(url, Options, function(response) {
        if (response.statusCode===200) {
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
            
        })
    })
 
    request.write(jsonData);
    request.end(); 
    
});


app.post("/failure", function(req, res) {
    res.redirect("/")
    
})


const PORT = process.env.PORT || 3000;



app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
    
});


