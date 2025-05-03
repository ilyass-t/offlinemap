import osmnx as ox
import folium
import os
import sys
from folium import MacroElement
from jinja2 import Template
sys.stdout.reconfigure(encoding='utf-8')

city = sys.argv[1]
graph_path = f"graphs/ALL{city.lower()}.graphml"
output_html = f"maps/{city.lower()}_map.html"  # dossier où tu veux stocker la carte
print(graph_path)
G = ox.load_graphml(graph_path)
nodes, edges = ox.graph_to_gdfs(G)

center = [nodes.geometry.y.mean(), nodes.geometry.x.mean()]

m = folium.Map(location=center, zoom_start=15, tiles=None)

folium.TileLayer(
    tiles="http://localhost:8000/{z}/{x}/{y}.png",
    attr="Offline Tiles",
    name="Offline Map",
    overlay=False,
    control=True
).add_to(m)

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
# lock_zoom_js = """
# {% macro script(this, kwargs) %}
#     var map = {{this._parent.get_name()}};
#     map.setMinZoom(15);
#     map.setMaxZoom(15);
# {% endmacro %}
# """

# class ZoomFix(MacroElement):
#     def __init__(self):
#         super().__init__()
#         self._template = Template(lock_zoom_js)

# m.get_root().add_child(ZoomFix())
os.makedirs("maps", exist_ok=True)
m.save(output_html)
print(f"✅ Map saved to {output_html}")
