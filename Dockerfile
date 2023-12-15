FROM caddy:latest
RUN mkdir -p /opt/todo
WORKDIR /opt/todo
COPY . ./
EXPOSE 443
CMD ["caddy","start"]