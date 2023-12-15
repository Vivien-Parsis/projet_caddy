const fastify = require('fastify')({logger: true});
const path = require('node:path');
const fs = require('node:fs');
const login = require('./private/login.json');
const SQLTool = require('./tool/SQLTool.js');
// const login = {
//     username:"",
//     login:""
// }
const currentPort = process.argv.length === 3 ? process.argv[2].includes("port=") ? Number.isInteger(Number(process.argv[2].split("=")[1])) ? process.argv[2].split("=")[1]:"3001":"3001":"3001";
fastify.register(require('@fastify/static'),{ 
    root: path.join(__dirname)+"/public",
    prefix: '/',
    decorateReply: true
})
fastify.register(require('@fastify/mysql'), {
    connectionString: `mysql://${login.username}:${login.password}@localhost/caddy_project`
})
fastify.get('/', (request, reply) => {
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile("index.html");
})
fastify.get('/assets/js/:fileJS', (request, reply) => {
    let fileJS = request.params.fileJS;
    if(!fs.existsSync(`public/assets/js/${fileJS}`) && !fs.existsSync(`public/assets/js/${fileJS.replace('.js','.min.js')}`)){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    fileJS = fs.existsSync(`public/assets/js/${fileJS.replace('.js','.min.js')}`) ? fileJS.replace('.js','.min.js') : fileJS;
    reply.headers({'Content-Type':'application/javascript','Cache-Control':'max-age=7890000,private'});
    reply.sendFile(`assets/js/${fileJS}`);
})
fastify.get('/assets/css/:fileCSS', (request, reply) => {
    let fileCSS = request.params.fileCSS;
    if(!fs.existsSync(`public/assets/css/${fileCSS}`) && !fs.existsSync(`public/assets/css/${fileCSS.replace('.css','.min.css')}`)){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    fileCSS = fs.existsSync(`public/assets/css/${fileCSS.replace('.css','.min.css')}`) ? fileCSS.replace('.css','.min.css') : fileCSS;
    reply.headers({'Content-Type':'text/css','Cache-Control':'max-age=7890000,public'});
    reply.sendFile(`assets/css/${fileCSS}`);
})
fastify.get('/assets/img/:fileIMG', (request, reply) => {
    let fileIMG = request.params.fileIMG;
    if(!fs.existsSync(`public/assets/img/${fileIMG}`)){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    const mimeType = `image/${fileIMG.endsWith(".ico") ? "x-icon" : fileIMG.endsWith(".png") ? "png" : fileIMG.endsWith(".svg") ? "sgv+xml" : ""}`;
    console.log(mimeType)
    reply.headers({'Content-Type':mimeType,'Cache-Control':'max-age=0,public'});
    reply.sendFile(`assets/img/${fileIMG}`);
})

fastify.get('/api/getTodo', (request, reply) => {
    fastify.mysql.query(
        'SELECT * from todo order by done_todo, date_todo asc',
        (err, result) => {
            reply.send(err || result)
        }
    )
})
fastify.post('/api/addTodo', (request, reply) => {
    let content = request.body.content;
    let date = request.body.date;
    if(!SQLTool.checkDate(date)){
        reply.code(304)
        reply.send("error, prevent sql injection attempting");
        return;
    }
    if(content==undefined||date==undefined){
        reply.code(304)
        reply.send("missing argument")
        return;
    }
    fastify.mysql.query(
        `insert into todo (content_todo,date_todo,done_todo) value ('${SQLTool.correctMySQL(content)}','${SQLTool.correctMySQL(date)}','0')`,
        (err, result) => {
            reply.code(201)
            reply.send(err || result)
        }
    )
})
fastify.post('/api/removeTodo', (request, reply) => {
    let id = request.body.id;
    if(id==undefined||id.trim()==''){
        reply.code(304)
        reply.send("missing argument")
        return;
    }if(!SQLTool.checkInt(id)){
        reply.code(304)
        reply.send("error, prevent sql injection attempting");
        return;
    }
    fastify.mysql.query(
        `delete from todo where id_todo=${SQLTool.correctMySQL(id)}`,
        (err, result) => {
            reply.send(err || result)
        }
    )
})
fastify.post('/api/modifyTodo', (request, reply) => {
    let id = request.body.id;
    let content = request.body.content;
    let date = request.body.date;
    let done = request.body.done;
    if(id==undefined||id.trim()==''||content==undefined||content.trim()==''||date==undefined||date.trim()==''||done==undefined){
        reply.code(304)
        reply.send("missing argument")
        return;
    }if(!SQLTool.checkInt(id) || !SQLTool.checkDate(date)){
        reply.code(304)
        reply.send("error, prevent sql injection attempting");
        return;
    }
    fastify.mysql.query(
        `update todo set content_todo='${SQLTool.correctMySQL(content)}',date_todo='${SQLTool.correctMySQL(date)}',done_todo='${SQLTool.correctMySQL(done)}' where id_todo=${SQLTool.correctMySQL(id)}`,
        (err, result) => {
            reply.send(err || result)
        }
    )
})
fastify.post('/api/doneTodo', (request, reply) => {
    let id = request.body.id;
    let done = request.body.done;
    if(id==undefined||id.trim()==''||done==undefined){
        reply.code(304)
        reply.send("missing argument");
        return;
    }if(!SQLTool.checkInt(id)){
        reply.code(304)
        reply.send("error, prevent sql injection attempting");
        return;
    }
    fastify.mysql.query(
        `update todo set done_todo='${SQLTool.correctMySQL(done)}' where id_todo=${SQLTool.correctMySQL(id)}`,
        (err, result) => {
            reply.send(err || result)
        }
    )
})
fastify.setNotFoundHandler((request, reply) => {
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile("page/404.html");
})
fastify.listen({ port : currentPort }, (err, address) => {
    if (err) throw err;
    console.log(`listening to ${address}`);
})