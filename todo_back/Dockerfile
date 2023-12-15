FROM node:18
RUN mkdir -p /opt/todo
WORKDIR /opt/todo
COPY todo_back/ ./todo_back
COPY todo_back/package.json todo_back/package-lock.json ./todo_back/
RUN cd todo_back
RUN npm i
CMD ["npm","run","start_todo"]