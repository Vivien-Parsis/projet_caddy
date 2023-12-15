FROM node:18-alpine
RUN mkdir -p /opt/todo
WORKDIR /opt/todo
COPY todo_back/ ./
RUN npm i
CMD ["npm","run","run_todo"]