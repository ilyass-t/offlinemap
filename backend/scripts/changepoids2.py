import osmnx as ox
import networkx as nx
import time
import threading
import sys

# Charger le graphe .graphml
G = ox.load_graphml("C:/Users/ilyas/Desktop/googlemaps/backend/backend/graphs/ALLmarrakech.graphml")

# 🔵 Faire une copie du graphe original
G_original = G.copy()

# 💡 Appliquer une pénalité de trafic à une rue spécifique
target_street = sys.argv[1]
penalty_factor = 3  # Multiplie la longueur par 3

for u, v, k, data in G.edges(keys=True, data=True):
    name = data.get("name")
    if name:
        if isinstance(name, list):
            if any(target_street.lower() in n.lower() for n in name):
                data["length"] *= penalty_factor
        elif target_street.lower() in name.lower():
            data["length"] *= penalty_factor

# 🔥 Fonction pour restaurer après 10 minutes
def restore_graph():
    time.sleep(600)  # 600 secondes = 10 minutes
    print("🔄 Temps écoulé : restauration du graphe original...")
    # Remplacer G par la copie originale
    global G
    G = G_original
    print("✅ Graphe restauré.")

# 🔥 Démarrer le processus de restauration en parallèle
threading.Thread(target=restore_graph, daemon=True).start()

# Convertir en GeoDataFrames
nodes, edges = ox.graph_to_gdfs(G)

# Définir les rues de départ et d’arrivée
start_street = "Avenue Al Markeb"
end_street = "Avenue Antaki"


# Chercher les arêtes correspondantes
start_edges = edges[edges['name'].astype(str).str.contains(start_street, case=False, na=False)]
end_edges = edges[edges['name'].astype(str).str.contains(end_street, case=False, na=False)]

if start_edges.empty:
    print(f"❌ Aucune rue trouvée avec le nom : {start_street}")
    print("Voici quelques noms de rue disponibles :")
    print(edges['name'].dropna().unique()[:20])
    exit()

if end_edges.empty:
    print(f"❌ Aucune rue trouvée avec le nom : {end_street}")
    print("Voici quelques noms de rue disponibles :")
    print(edges['name'].dropna().unique()[:20])
    exit()

# Obtenir un point GPS au milieu d'un segment
start_point = start_edges.iloc[0].geometry.interpolate(0.5, normalized=True)
end_point = end_edges.iloc[0].geometry.interpolate(0.5, normalized=True)

# Trouver les nœuds les plus proches
start_node = ox.distance.nearest_nodes(G, X=start_point.x, Y=start_point.y)
end_node = ox.distance.nearest_nodes(G, X=end_point.x, Y=end_point.y)

# Calculer le plus court chemin (pondéré par la distance)
shortest_path = nx.shortest_path(G, source=start_node, target=end_node, weight='length')

# (Facultatif) Afficher ou utiliser shortest_path ici
