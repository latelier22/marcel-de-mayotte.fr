import os
import json
from PIL import Image

# Chemin du dossier contenant les images
dossier_images = "./images"  # Assume que le dossier images est dans le même répertoire que le script

# Liste pour stocker les informations sur les images
images_info = []

# Parcourir les fichiers dans le dossier
for fichier in os.listdir(dossier_images):
    chemin_image = os.path.join(dossier_images, fichier)
    if os.path.isfile(chemin_image):
        # Ouvrir l'image avec PIL
        with Image.open(chemin_image) as img:
            # Obtenir les dimensions de l'image
            width, height = img.size
            # Ajouter les informations dans la liste
            images_info.append({"src": chemin_image, "width": width, "height": height})

# Chemin du fichier JSON à créer dans le même répertoire que le script
fichier_json = "photos.json"

# Écrire les informations dans le fichier JSON
with open(fichier_json, "w") as json_file:
    json.dump(images_info, json_file, indent=2)

print("Les informations sur les images ont été enregistrées dans", fichier_json)
