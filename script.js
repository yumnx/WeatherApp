class WeatherApp {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";

        this.cityInput = document.getElementById("cityInput");
        this.searchBtn = document.getElementById("searchBtn");
        this.weatherResult = document.getElementById("weatherResult");
        this.background = document.getElementById("background");
        this.historyList = document.getElementById("historyList");

        this.searchBtn.addEventListener("click", () => this.searchWeather());
        this.cityInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.searchWeather();
        });

        this.loadHistory();
    }

    async fetchWeather(city) {
        const response = await fetch(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=id`);
        if (!response.ok) throw new Error("Kota tidak ditemukan.");
        return await response.json();
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) return alert("Masukkan nama kota.");

        try {
            const data = await this.fetchWeather(city);
            this.renderWeather(data);
            this.updateBackground(data.weather[0].main.toLowerCase());
            this.saveToHistory(city);
        } catch (err) {
            alert(err.message);
        }
    }

    renderWeather(data) {
        const weather = data.weather[0].description;
        const temp = Math.round(data.main.temp);
        const wind = data.wind.speed;
        const humidity = data.main.humidity;
        const cloud = data.clouds.all;
        const rain = data.rain ? `${data.rain['1h'] || data.rain['3h']} mm` : "0 mm";

        this.weatherResult.innerHTML = `
            <h2>${temp}°</h2>
            <p>${data.name}</p>
            <p>${weather}</p>
            <p><strong>Cloudy:</strong> ${cloud}%</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind:</strong> ${wind} km/h</p>
            <p><strong>Rain:</strong> ${rain}</p>
        `;
    }

    updateBackground(weatherType) {
        let image = "img/default.jpeg";
        if (weatherType.includes("rain")) image = "img/rain.jpeg";
        else if (weatherType.includes("cloud")) image = "img/cloudy.jpeg";
        else if (weatherType.includes("clear")) image = "img/clear.jpeg";
        else if (weatherType.includes("snow")) image = "img/snow.jpeg";
        else if (weatherType.includes("storm") || weatherType.includes("thunder")) image = "img/torm.jpg";
        this.background.style.backgroundImage = `url('${image}')`;
    }

    saveToHistory(city) {
        let history = JSON.parse(localStorage.getItem("weather_history")) || [];
        history = history.filter(c => c.toLowerCase() !== city.toLowerCase()); 
        history.unshift(city);
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem("weather_history", JSON.stringify(history));
        this.loadHistory();
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem("weather_history")) || [];
        this.historyList.innerHTML = "";
        history.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city;
            li.addEventListener("click", () => {
                this.cityInput.value = city;
                this.searchWeather();
            });
            this.historyList.appendChild(li);
        });
    }
}

const app = new WeatherApp("17ecb8bbc700fe9ce6c184bcad539981");
