const btn = document.getElementById("btn");
const btn2 = document.getElementById("btn2");
const summary = document.getElementById("summary");
const temp2 = document.getElementById("temp");
const ws = document.getElementById("ws");
const zone = document.getElementById("zone");
const air = document.getElementById("aq");

function sendLocation() {
    navigator.geolocation.getCurrentPosition(async pos =>{
        const lat = pos.coords.latitude.toFixed(2);
        const lon = pos.coords.longitude.toFixed(2);
        const mood = document.getElementById("mood").value;

        const api_url = `/weather/${lat},${lon}`;
        const resp = await fetch(api_url);
        const data2 = await resp.json();
        console.log(data2.aq.results[0].measurements[0].value);

        summary.innerText = data2.weather.daily.summary;
        temp2.innerText = data2.weather.currently.temperature;
        ws.innerText = data2.weather.currently.windSpeed;
        zone.innerText = data2.weather.timezone;
        air.innerText = data2.aq.results[0].measurements[0].value;

        const weather = {
            place: data2.weather.timezone,
            summary: data2.weather.daily.summary,
            temp: data2.weather.currently.temperature,
            windSpeed: data2.weather.currently.windSpeed,
        }

        const data = {mood, lat, lon, weather};
        console.log(data);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        const response = await fetch("/api", options);
        const recievedData = await response.json();

        const root = document.createElement("div");
        const res = document.createElement("div");


        root.append(res);
        document.body.append(root);
    });
}

btn.addEventListener("click", sendLocation);

async function getData() {
    const res = await fetch("/api");
    const msg = await res.json();
    for (item of msg) {
        const root = document.createElement("div");
        const mood = document.createElement("div");
        const geo = document.createElement("div");
        const date = document.createElement("div");

        mood.textContent = `mood: ${item.mood}`;
        geo.textContent = `location is ${item.lat}, ${item.lon}`;
        date.textContent = `date: ${item.time}`;

        root.append(mood, geo, date);
        document.body.append(root);
    }
}

btn2.addEventListener("click", getData);