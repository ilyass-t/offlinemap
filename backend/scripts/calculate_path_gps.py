import sys
import osmnx as ox
import networkx as nx
import folium
import json
from datetime import datetime, time
import os
sys.stdout.reconfigure(encoding='utf-8')

# Lire les arguments
start_lat = float(sys.argv[1])
start_lon = float(sys.argv[2])
end_street = sys.argv[3]
graphml_file = sys.argv[4]
nom_url = end_street.replace(" ", "")

# Charger le graphe
graph_path = f"graphs/{graphml_file}"
if not os.path.exists(graph_path):
    print(f"❌ Fichier GraphML non trouvé : {graph_path}")
    exit()

G = ox.load_graphml(graph_path)
nodes, edges = ox.graph_to_gdfs(G)

# Charger les rues embouteillées
congestion_file = 'data/traffic_data.json'
if os.path.exists(congestion_file):
    with open(congestion_file, 'r', encoding='utf-8') as f:
        congested_streets = json.load(f)
else:
    congested_streets = []

def parse_hour(h):
    try:
        return datetime.strptime(h.zfill(5), '%H:%M').time() if ':' in h else time(int(h))
    except Exception:
        return None

def is_congested(street_name):
    for entry in congested_streets:
        if entry["street"].lower() in street_name.lower():
            from_hour = parse_hour(str(entry["from_hour"]))
            to_hour = parse_hour(str(entry["to_hour"]))
            if from_hour and to_hour:
                now_time = datetime.now().time()
                if from_hour <= to_hour:
                    if from_hour <= now_time <= to_hour:
                        return True
                else:
                    if now_time >= from_hour or now_time <= to_hour:
                        return True
    return False

# Supprimer les rues embouteillées
edges_to_drop = edges[edges['name'].astype(str).apply(is_congested)]
ignored_names = [str(name) for name in edges_to_drop['name'].unique()]
print(f"⛔ Rues ignorées pour embouteillage : {', '.join(ignored_names)}")

G.remove_edges_from(edges_to_drop.index.tolist())

# Recharger les edges après suppression
_, edges = ox.graph_to_gdfs(G)

# Trouver l'end_point basé sur le nom de rue
end_edges = edges[edges['name'].astype(str).str.contains(end_street, case=False, na=False)]
if end_edges.empty:
    print(f"❌ Aucune rue trouvée avec le nom : {end_street}")
    exit()

# Localisation de l'utilisateur
start_point = (start_lat, start_lon)

# Localisation d'arrivée (milieu de segment)
end_point_geom = end_edges.iloc[0].geometry.interpolate(0.5, normalized=True)
end_point = (end_point_geom.y, end_point_geom.x)

# Trouver les nœuds les plus proches
start_node = ox.distance.nearest_nodes(G, X=start_point[1], Y=start_point[0])
end_node = ox.distance.nearest_nodes(G, X=end_point[1], Y=end_point[0])

# Calculer le plus court chemin
try:
    shortest_path = nx.shortest_path(G, source=start_node, target=end_node, weight='length')
except nx.NetworkXNoPath:
    print("❌ Aucun chemin trouvé entre le point de départ et la destination.")
    exit()

# Récupérer les coordonnées
path_coords = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in shortest_path]

# Créer la carte
m = folium.Map(location=path_coords[len(path_coords)//2], zoom_start=15, tiles=None,
               scrollWheelZoom=False, zoomControl=False)
folium.TileLayer(tiles="http://localhost:8000/{z}/{x}/{y}.png", attr="Offline Tiles", name="Offline Map").add_to(m)

# Ajouter les routes
for _, row in edges.iterrows():
    if row.geometry.geom_type == 'LineString':
        coords = [(lat, lon) for lon, lat in row.geometry.coords]
        folium.PolyLine(coords, color="blue", weight=2).add_to(m)

# Ajouter les nœuds
for _, row in nodes.iterrows():
    folium.CircleMarker(
        location=(row.geometry.y, row.geometry.x),
        radius=2,
        color="red",
        fill=True,
        fill_opacity=0.6
    ).add_to(m)

# Ajouter le chemin trouvé
folium.PolyLine(path_coords, color="green", weight=5, opacity=0.8, tooltip="Shortest Path").add_to(m)
folium.Marker(path_coords[0], popup="Départ", icon=folium.Icon(color='green')).add_to(m)
folium.Marker(path_coords[-1], popup="Arrivée", icon=folium.Icon(color='red')).add_to(m)

# Sauvegarder la carte
os.makedirs("paths", exist_ok=True)
m.save(f"paths/{nom_url}.html")
print("✅ Carte avec le chemin sauvegardée.")

# 📋 Affichage des rues traversées
edge_list = list(zip(shortest_path[:-1], shortest_path[1:]))
street_names = []

for u, v in edge_list:
    data = G.get_edge_data(u, v)
    if data:
        edge = data[list(data.keys())[0]]
        name = edge.get('name')
        if name:
            if isinstance(name, list):
                street_names.extend(name)
            else:
                street_names.append(name)

# 🧹 Supprimer doublons tout en gardant l'ordre
seen = set()
unique_streets = [x for x in street_names if not (x in seen or seen.add(x))]

# 🖨️ Affichage
print("📍 Rues traversées :")
for street in unique_streets:
    print(f"➡️ {street}")
