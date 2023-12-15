FROM node:18
RUN mkdir -p /opt/todo
WORKDIR /opt/todo
COPY todo_back/package.json todo_back/package-lock.json ./
RUN npm i
COPY todo_back/ ./
EXPOSE 4001
CMD ["npm","run","todo"]