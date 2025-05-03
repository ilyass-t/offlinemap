import os
import sys
import requests
import mercantile
from tqdm import tqdm

city = sys.argv[1]


def get_bbox_from_city(city):
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={city}"
    headers = {"User-Agent": "OfflineTileDownloader/1.0"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()

    if not data:
        raise ValueError(f"Nominatim did not geocode query for: {city}")

    boundingbox = data[0]["boundingbox"]
    lat_min = float(boundingbox[0])
    lat_max = float(boundingbox[1])
    lon_min = float(boundingbox[2])
    lon_max = float(boundingbox[3])

    return lat_min, lat_max, lon_min, lon_max


try:
    lat_min, lat_max, lon_min, lon_max = get_bbox_from_city(city)
except Exception as e:
    print(f"Erreur lors de la récupération des coordonnées pour {city}: {e}")
    sys.exit(1)

zoom_levels = range(1, 16)
tile_server = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
output_dir = f"ALLtiles/{city.lower()}"

headers = {
    'User-Agent': 'OfflineTileDownloader/1.0'
}

for z in zoom_levels:
    tiles = list(mercantile.tiles(lon_min, lat_min, lon_max, lat_max, [z]))
    print(f"Downloading zoom level {z}, {len(tiles)} tiles")

    for tile in tqdm(tiles):
        x, y = tile.x, tile.y
        url = tile_server.format(z=z, x=x, y=y)
        path = os.path.join(output_dir, str(z), str(x))
        filename = os.path.join(path, f"{y}.png")

        if os.path.exists(filename):
            continue

        os.makedirs(path, exist_ok=True)

        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code == 200:
                with open(filename, "wb") as f:
                    f.write(r.content)
            else:
                print(f"Failed to download tile {z}/{x}/{y}")
        except Exception as e:
            print(f"Error downloading {z}/{x}/{y}: {e}")
