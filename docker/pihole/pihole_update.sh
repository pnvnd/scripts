#! /bin/bash
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games"
sudo docker pull pihole/pihole
sudo docker stop pihole
sudo docker rm -f pihole
sudo docker-compose -f /opt/pihole/docker-compose.yml up -d
sudo docker image prune -f