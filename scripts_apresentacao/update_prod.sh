#!/bin/bash
cd ~/ger-con/data/producao
sudo git pull origin main
sudo docker compose up -d --build producao
cd ~