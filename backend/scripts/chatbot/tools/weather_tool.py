
import os
import requests
from langchain.tools import Tool

def get_weather(location: str) -> str:
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": location,
        "appid": api_key,
        "units": "metric",
        "lang": "fr"
    }
    response = requests.get(url, params=params)
    data = response.json()

    if data.get("weather"):
        desc = data["weather"][0]["description"]
        temp = data["main"]["temp"]
        return f"Météo à {location} : {desc}, {temp}°C"
    return "Impossible d'obtenir la météo."

weather_tool = Tool(
    name="WeatherTool",
    func=get_weather,
    description="Donne la météo actuelle pour une ville donnée."
)

print(get_weather("marrakech"))