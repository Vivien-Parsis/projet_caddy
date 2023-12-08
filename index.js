const login = {
    username:"",
    login:""
}
const fastify = require('fastify')({logger: true})
const path = require('node:path');
fastify.register(require('@fastify/static'),{ 
    root: path.join(__dirname),
    prefix: '/',
    decorateReply: true
})
fastify.register(require('@fastify/cors'),{origin:"http://localhost:3001"})
fastify.register(require('@fastify/mysql'), {
    connectionString: `mysql://${login.username}:${login.password}@localhost/caddy_project`
})

fastify.get('/', (request, reply) => {
    reply.header('Content-Type', 'text/HTML');
    reply.sendFile("public/index.html");
})

fastify.listen({ port: 3001 }, (err, address) => {
    console.log(`listening to ${address}`);
    if (err) throw err;
})
