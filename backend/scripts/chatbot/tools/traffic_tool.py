import os
import requests
from langchain.tools import Tool
from dotenv import load_dotenv
load_dotenv()
# Fonction 1 : temps et embouteillage entre deux lieux
import os
import requests

def get_traffic_duration(origin: str, destination: str) -> str:
    # Assure-toi d'avoir défini ta clé d'API Google Maps dans les variables d'environnement
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")


    # URL de l'API Directions de Google Maps
    url = "https://maps.googleapis.com/maps/api/directions/json"

    # Paramètres de la requête
    params = {
        "origin": origin,           # Lieu d'origine
        "destination": destination, # Lieu de destination
        "departure_time": "now",    # Heure de départ = maintenant pour avoir l'info sur le trafic actuel
        "key": api_key              # Ta clé API Google Maps
    }

    # Effectuer la requête GET
    response = requests.get(url, params=params)
    data = response.json()

    # Affichage pour déboguer et vérifier les réponses API
    print("URL request:", response.url)  # URL de la requête
    print("Response data:", data)  # Réponse complète de l'API

    if "routes" in data and data["routes"]:
        leg = data["routes"][0]["legs"][0]
        if "duration_in_traffic" in leg:
            duration_in_traffic = leg["duration_in_traffic"]["text"]
        else:
            duration_in_traffic = leg["duration"]["text"]  # fallback sans trafic
        return f"Temps de trajet de {origin} à {destination} : {duration_in_traffic}"
    else:
        return f"❌ Aucune route trouvée entre {origin} et {destination}. Vérifie les noms."



def get_coordinates(address: str) -> dict:
    """ Fonction pour obtenir les coordonnées (latitude, longitude) à partir de l'adresse. """
    api_key = os.getenv("TOMTOM_API_KEY")
    url = f"https://api.tomtom.com/search/2/geocode/{address}.json"

    params = {
        "key": api_key
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "results" in data and len(data["results"]) > 0:
        lat = data["results"][0]["position"]["lat"]
        lon = data["results"][0]["position"]["lon"]
        return lat, lon
    else:
        return None, None

def check_congestion_tomtom(lat: float, lon: float) -> str:
    """ Vérifie la congestion du trafic pour les coordonnées données. """
    api_key = os.getenv("TOMTOM_API_KEY")
    url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"

    params = {
        "point": f"{lat},{lon}",
        "unit": "KMPH",
        "key": api_key
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "flowSegmentData" in data:
        current_speed = data["flowSegmentData"]["currentSpeed"]
        free_flow_speed = data["flowSegmentData"]["freeFlowSpeed"]
        confidence = data["flowSegmentData"]["confidence"]
        congestion = "oui" if current_speed < 0.7 * free_flow_speed else "non"
        return (
            f"Vitesse actuelle : {current_speed} km/h\n"
            f"Vitesse normale : {free_flow_speed} km/h\n"
            f"Confiance : {confidence}\n"
            f"Embouteillage détecté ? {congestion}"
        )
    else:
        return "❌ Impossible d'obtenir les données TomTom."

def get_traffic_info(address: str) -> str:
    """ Fonction principale pour obtenir les infos de trafic d'une adresse. """
    lat, lon = get_coordinates(address)
    if lat is None or lon is None:
        return "❌ Impossible de géocoder l'adresse."

    return check_congestion_tomtom(lat, lon)


def get_nearby_bus_terminuses(address: str) -> str:
    lat, lon = get_coordinates(address)
    if lat is None or lon is None:
        return "❌ Adresse non reconnue."

    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    node(around:800,{lat},{lon})[highway=bus_stop];
    out body;
    """

    try:
        response = requests.post(overpass_url, data={"data": query}, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        return f"❌ Erreur Overpass : {e}"

    if "elements" in data and data["elements"]:
        stops = data["elements"]
        stop_names = list({s["tags"].get("name", "Sans nom") for s in stops})
        if not stop_names:
            return "✅ Aucun nom de terminus trouvé, mais des arrêts existent."
        return f"🚌 Terminus proches de {address} :\n- " + "\n- ".join(stop_names[:5])
    else:
        return "❌ Aucun arrêt ou terminus trouvé à proximité."

def get_bus_stops_along_route(start_address: str, end_address: str) -> str:
    lat1, lon1 = get_coordinates(start_address)
    lat2, lon2 = get_coordinates(end_address)

    if None in (lat1, lon1, lat2, lon2):
        return "❌ Impossible de géocoder l'une des adresses."

    # Calcul du centre du segment
    center_lat = (lat1 + lat2) / 2
    center_lon = (lon1 + lon2) / 2

    # Déterminer un rayon de recherche (en mètres), ex. 1000 m
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    (
      node(around:1000,{center_lat},{center_lon})[highway=bus_stop];
    );
    out body;
    """

    try:
        response = requests.post(overpass_url, data={"data": query}, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        return f"❌ Erreur Overpass : {e}"

    if "elements" in data and data["elements"]:
        stop_names = list({s["tags"].get("name", "Sans nom") for s in data["elements"]})
        if not stop_names:
            return "Aucun arrêt nommé trouvé sur le trajet."
        return f"🚌 Terminus entre {start_address} et {end_address} :\n- " + "\n- ".join(stop_names[:10])
    else:
        return "❌ Aucun arrêt de bus trouvé sur le trajet."

# Déclaration de deux outils LangChain
traffic_duration_tool = Tool(
    name="TrafficDurationTool",
    func=lambda input: get_traffic_duration(*input.split(" to ")),
    description="Donne la durée avec et sans trafic entre deux lieux. Format: 'origin to destination'."
)
traffic_street_tool = Tool(
    name="Trafficstreet",
    func=lambda input: get_traffic_info(*input.split(" to ")),
    description="Donne s'il ya un traffic dans une rue."
)

bus_route_tool = Tool(
    name="BusStopsAlongRouteTool",
    func=lambda input: get_bus_stops_along_route(*input.split(" to ")),
    description="Retourne les arrêts ou terminus de bus entre deux adresses. Format: 'adresse1 to adresse2'"
)

bus_terminus_tool = Tool(
    name="NearbyBusTerminusTool",
    func=get_nearby_bus_terminuses,
    description="Retourne les terminus ou arrêts de bus proches d'une adresse. Utiliser une rue ou ville en entrée."
)
