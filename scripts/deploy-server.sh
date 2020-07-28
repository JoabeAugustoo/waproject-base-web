#!/bin/bash
echo 'Deploing ' $SERVER_HOST '...'
mkdir -p ~/.ssh
(umask  077 ; echo $SSH_KEY | base64 --decode > ~/.ssh/id_rsa)
ssh ubuntu@$SERVER_HOST 'cd'  $SERVER_DIR '&& docker-compose pull && docker-compose down && docker-compose up -d --build'
