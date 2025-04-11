#!/bin/bash

ssh debian@vps.latelier22.fr << 'EOF'
  cd ~/marcel-de-mayotte.fr
  git reset --hard HEAD
  git pull
  sudo pnpm install
  sudo pnpm run build
  pm2 restart 0
EOF
echo "Deployment completed successfully."