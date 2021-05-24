import 'dotenv/config';
import cors from 'cors';
import express from 'express';
 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

var item;

//Handle get request for cards table 

app.get('/cards', (req, res) => {
    console.log(req.query.pk_card)
    var card = getCard(req.query.pk_card).then(function(result) {
        console.log(result)
        item = result; // "Some User token"
    });
    return res.send(Object.values(item));
});

//Handle post request for cards table 

app.post("/cards", (req, res) => {
    if (req.body.delete){
        deleteCard(String(req.body.pk_card));
    }
    else{
        console.log(req.body.pk_card);
        postCard(req.body);
    }
});

//Handle delete request for cards table 

app.delete("/cards", (req, res) => {
    console.log(res.data +  "jee");

    //deleteCard(res.data.json.pk_card);
});

app.get('/', (req, res) => {
    var path = require('path');
    res.sendFile('index.html', {root: 'dist' });
  });

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

//Get card from dynamodb database

async function getCard(pk){
    var AWS = require("aws-sdk");

    AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "tblCards";

    var params = {
        TableName: table
    };

    return docClient.scan(params).promise().then(res => {return res});
}

//Post card to dynamodb database

async function postCard(cardInfo){
    var AWS = require("aws-sdk");

    AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "tblCards";
    //console.log(String(cardInfo[0]))
    var params = {
        TableName: table,
        Item:{
            "pk_card": cardInfo.pk_card,
            "card_name": cardInfo.card_name,
            "card_text": cardInfo.card_text
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(params, null, 2));
        }
    });
}

async function deleteCard(pk){
    var AWS = require("aws-sdk");

    AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "tblCards";

    var params = {
        TableName:table,
        Key:{
            "pk_card": pk
        }
    };
    console.log("Attempting a conditional delete...");
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}