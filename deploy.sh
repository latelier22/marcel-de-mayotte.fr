#!/bin/bash

# Script de déploiement pour marcel-de-mayotte.fr

ssh debian@vps.latelier22.fr << 'EOF'
  cd /marcel-de-mayotte.fr
  git pull
  sudo pnpm run build
  pm2 restart 0
EOF
