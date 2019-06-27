const express = require("express");
const fs = require("fs");
const dataStore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new dataStore("database.db");
database.loadDatabase();

app.get("/api", (req, res) => {
    database.find({}).limit(2).exec((err, data) => {
        res.json(data);
    });
});

app.post("/api", (req, res) => {
    const data = req.body;
    const time = new Date().toLocaleTimeString();
    data.time = time;
    database.insert(data);
});
 
app.get("/weather/:latlon", async (req, res) => {
    const latlon = req.params.latlon.split(",");
    const lat = latlon[0];
    const lon = latlon[1];

    const api_key = process.env.API_KEY;

    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
    const weather_resp = await fetch(weather_url);
    const weather_data2 = await weather_resp.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_resp = await fetch(aq_url);
    const aq_data2 = await aq_resp.json();

    const data2 = {
        weather: weather_data2,
        aq: aq_data2
    }

    res.json(data2);
});

app.listen(3000);

// function createChart() {
//     const ctx = document.getElementById('chart').getContext('2d');
//     const myChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19, 3, 5, 2, 123],
//                 backgroundColor: ['rgba(255, 99, 132, 0.2)'],
//                 borderColor: ['rgba(255, 99, 132, 1)'],
//                 borderWidth: 1
//             }]
//         }
//     });
// }

// createChart();

// getCsv().then(res => {
//     console.log("Got it")
// }).catch(err => {
//     console.error(err);
// });

// async function getCsv() {
//     const res = await fetch("img/ZonAnn.Ts+dSST.csv");
//     const data = await res.text();

//     const table = data.split("\n").slice(1);
//     table.forEach(row => {
//         const columns = row.split(",");
//         const year = columns[0];
//         const temp = columns[1];
//         console.log(year, temp);
//     });
// }

// getText().then(data=> {
//     document.getElementById("text").innerText = data;
// }).catch(err => {
//     console.error(err);
// });

// async function getText() {
//     const res = await fetch("img/sample.txt");
//     return await res.text();
// }

// const arr = ["img/001.jpg", "img/002.jpg"];

// getImg(arr).then(res => {
//     console.log("Got it")
// }).catch(err => {
//     console.error(err);
// });

// async function getImg(arr) {
//     for (let ar of arr) {
//         const res = await fetch(ar);
//         const blob = await res.blob();
//         const img2 = document.createElement("img");
//         img2.src = URL.createObjectURL(blob);
//         img2.width = 200;
//         document.body.append(img2);
//     }
// }