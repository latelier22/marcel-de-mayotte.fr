import sqlite3
import json

# Charger les données depuis le fichier JSON
with open('catalogue.json', 'r') as f:
    data = json.load(f)

# Fonction pour créer la base de données SQLite
def creer_base_de_donnees():
    # Connexion à la base de données SQLite (crée le fichier s'il n'existe pas)
    conn = sqlite3.connect('votre_base_de_donnees.db')
    c = conn.cursor()

    # Créer la table pour les photos
    c.execute('''CREATE TABLE IF NOT EXISTS Photos
                 (numero INTEGER PRIMARY KEY,
                 largeur INTEGER,
                 hauteur INTEGER,
                 nomFichier TEXT,
                 url TEXT)''')

    # Créer la table pour les tags
    c.execute('''CREATE TABLE IF NOT EXISTS Tags
                 (tag TEXT PRIMARY KEY)''')

    # Créer la table pour la relation many-to-many entre les photos et les tags
    c.execute('''CREATE TABLE IF NOT EXISTS PhotoTag
                 (photo_numero INTEGER,
                 tag TEXT,
                 FOREIGN KEY(photo_numero) REFERENCES Photos(numero),
                 FOREIGN KEY(tag) REFERENCES Tags(tag),
                 PRIMARY KEY(photo_numero, tag))''')

    # Insérer les données des photos dans la table Photos
    for photo in data:
        numero = photo['numero']
        dimensions = photo.get('dimensions')  # Récupérer les dimensions de la photo
        if dimensions is not None:  # Vérifier si les dimensions sont présentes
            largeur, hauteur = dimensions  # Déballer les dimensions si elles existent
            nom_fichier = photo['nomFichierComplet']
            url = photo['url']
            c.execute('''INSERT INTO Photos (numero, largeur, hauteur, nomFichier, url)
                         VALUES (?, ?, ?, ?, ?)''', (numero, largeur, hauteur, nom_fichier, url))

            # Insérer les tags dans la table Tags et créer les relations many-to-many dans la table PhotoTag
            for tag in photo['tags']:
                c.execute('''INSERT OR IGNORE INTO Tags (tag) VALUES (?)''', (tag,))
                c.execute('''INSERT INTO PhotoTag (photo_numero, tag) VALUES (?, ?)''', (numero, tag))

    # Valider les changements et fermer la connexion à la base de données
    conn.commit()
    conn.close()

# Appeler la fonction pour créer la base de données
creer_base_de_donnees()