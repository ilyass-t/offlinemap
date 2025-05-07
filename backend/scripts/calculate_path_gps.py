import sys
import osmnx as ox
import networkx as nx
import folium
import os
sys.stdout.reconfigure(encoding='utf-8')

# Lire les arguments
start_lat = float(sys.argv[1])
start_lon = float(sys.argv[2])
end_street = sys.argv[3]
graphml_file = sys.argv[4]  # ← ajouter ici
nom_url = sys.argv[3].replace(" ", "")

# Charger le graphe envoyé
if not os.path.exists(f"graphs/{graphml_file}"):
    print(f"❌ Fichier GraphML non trouvé : graphs/{graphml_file}")
    exit()

G = ox.load_graphml(f"graphs/{graphml_file}")

# Convertir en GeoDataFrames
nodes, edges = ox.graph_to_gdfs(G)

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
shortest_path = nx.shortest_path(G, source=start_node, target=end_node, weight='length')

# Récupérer les coordonnées
path_coords = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in shortest_path]





# Create map centered on start location
m = folium.Map(location=path_coords[0], zoom_start=17, tiles=None, scrollWheelZoom=False, zoomControl=False)


folium.TileLayer(tiles="http://localhost:8000/{z}/{x}/{y}.png", attr="Offline Tiles", name="Offline Map").add_to(m)

for _, row in edges.iterrows():
    if row.geometry.geom_type == 'LineString':
        coords = [(lat, lon) for lon, lat in row.geometry.coords]
        folium.PolyLine(coords, color="blue", weight=2).add_to(m)

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

os.makedirs("paths", exist_ok=True)

m.save( f"paths/{nom_url}.html")
print("✅ Carte avec le chemin sauvegardée.")
