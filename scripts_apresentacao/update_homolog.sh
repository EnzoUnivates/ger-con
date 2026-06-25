#!/bin/bash
cd ~/ger-con/data/homologacao
sudo git pull origin main
sudo docker compose up -d --build homologacao
cd ~