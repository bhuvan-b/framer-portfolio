FROM ubuntu:latest

RUN apt-get update

WORKDIR /home/ubuntu

COPY . .

RUN apt install nodejs -y

CMD ["node", "server.js"] 
