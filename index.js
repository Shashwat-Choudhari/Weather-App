import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
const port = 3000;
const API_URL = "https://api.open-meteo.com/v1/forecast?";
const parameters = "&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3";


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/search",async (req,res)=>{
    const Latitude = req.body.latitude;
    const Longitude = req.body.longitude;
    try {
        const result = await axios.get(API_URL+`latitude=${Latitude}&longitude=${Longitude}`+parameters);
        const content = result.data;
        const currentData = content.current;
        const timezone = JSON.stringify(content.timezone);
        const current_time = JSON.stringify(currentData.time);
        const current_temperature = JSON.stringify(currentData.temperature_2m);
        const day_night = JSON.stringify(currentData.is_day);
        const current_weather = JSON.stringify(currentData.weather_code);
        const current_wind = JSON.stringify(currentData.wind_speed_10m);
        const preci = JSON.stringify(currentData.precipitation);
        const rel_hum = JSON.stringify(currentData.relative_humidity_2m);
        const dailyData = content.daily;
        const dailyTime = dailyData.time;
        const dailyMaxTemperatures = dailyData.temperature_2m_max;
        const dailyMinTemperatures = dailyData.temperature_2m_min;
        const dailyWeathercodes = dailyData.weather_code;
        
        

        res.render("index.ejs",{Timezone: timezone,time: current_time,temp: current_temperature,is_day: day_night,weather: current_weather,wind_speed: current_wind,precipitation: preci,humidity: rel_hum,forecast_times: dailyTime,maxTemps: dailyMaxTemperatures,minTemps: dailyMinTemperatures,forecast_weather: dailyWeathercodes});
        
    } catch (error) {
        res.status(404).send(error.message);  
    }
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});