import osmnx as ox
import sys
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Récupère la ville depuis les arguments
city = sys.argv[1].strip().lower()

os.makedirs("graphs", exist_ok=True)

file_path = os.path.join("graphs", f"ALL{city}.graphml")

try:
    G = ox.graph_from_place(city, network_type="all")
    ox.save_graphml(G, filepath=file_path)
    print(f"✅ Fichier {file_path} enregistré avec succès.")
except Exception as e:
    print(f"❌ Erreur lors du téléchargement ou de l'enregistrement du graphe: {e}")
    sys.exit(1)
