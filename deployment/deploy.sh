#!/bin/bash
set -e

echo "🚀 Deploying Msingi Gym..."

# Configuration
CPANEL_USER="msingico"
CPANEL_HOST="msingi.co.ke"
BACKEND_DIR="/home/$CPANEL_USER/node_apps/msingi-gym"
FRONTEND_DIR="/home/$CPANEL_USER/public_html"

# Build React
cd ../frontend-react
npm run build:prod

# Deploy frontend
echo "Deploying frontend..."
rsync -avz --delete build/ $CPANEL_USER@$CPANEL_HOST:$FRONTEND_DIR/

# Deploy backend
echo "Deploying backend..."
rsync -avz --exclude='node_modules' ../backend/ $CPANEL_USER@$CPANEL_HOST:$BACKEND_DIR/

# Install dependencies
ssh $CPANEL_USER@$CPANEL_HOST "cd $BACKEND_DIR && npm install --production"

# Restart backend
ssh $CPANEL_USER@$CPANEL_HOST "cd $BACKEND_DIR && pm2 restart msingi-gym || pm2 start server.js --name msingi-gym"

echo "✅ Deployment completed!"