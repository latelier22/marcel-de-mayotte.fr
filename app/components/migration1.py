import sqlite3

# Fonction pour effectuer la migration
def migration():
    # Connexion à la base de données SQLite
    conn = sqlite3.connect('votre_base_de_donnees.db')
    c = conn.cursor()

    # Vérifier si le tag "Autres" existe déjà
    c.execute("SELECT COUNT(*) FROM Tags WHERE tag = 'Autres'")
    tag_autres_count = c.fetchone()[0]

    # Si le tag "Autres" n'existe pas, l'ajouter avec "Catalogue complet" comme parent
    if tag_autres_count == 0:
        c.execute("INSERT INTO Tags (tag, parent_id) SELECT 'Autres', id FROM Tags WHERE tag = 'Catalogue complet'")
        conn.commit()
        print("Le tag 'Autres' a été ajouté avec succès.")

    # Obtenir l'ID du tag "Progressions"
    c.execute("SELECT id FROM Tags WHERE tag = 'Progressions'")
    progressions_id = c.fetchone()[0]

    # Obtenir l'ID du tag "Autres"
    c.execute("SELECT id FROM Tags WHERE tag = 'Autres'")
    autres_id = c.fetchone()[0]

    # Mettre à jour les photos pour leur attribuer le tag "Autres" si elles ne sont pas des "Progressions"
    c.execute("UPDATE Photos SET tag_id = ? WHERE tag_id != ? AND numero NOT IN (SELECT DISTINCT photo_numero FROM PhotoTag WHERE tag_id = ?)", (autres_id, progressions_id, progressions_id))
    conn.commit()
    print("La migration a été effectuée avec succès.")

    # Fermer la connexion à la base de données
    conn.close()

# Appeler la fonction de migration
migration()
