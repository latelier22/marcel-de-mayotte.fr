# Utilisez une image Node.js comme base
FROM node:latest

# Définissez le répertoire de travail
WORKDIR /app

# Copiez le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tout le contenu de votre projet dans le conteneur
COPY . .

# Exposez le port utilisé par votre application Next.js
EXPOSE 3006

# Démarrez votre application avec PM2 (ou npm start, selon votre configuration)
CMD ["npm", "run", "dev"]
