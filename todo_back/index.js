const fastify = require('fastify')({logger: true});
const path = require('node:path');
const fs = require('node:fs');
const login =  fs.existsSync('./private/login.json') ? require('./private/login.json') 
: {"username":"","password":""};//put your mysql login here
const SQLTool = require('./tool/SQLTool.js');
//fix for custom port with npm script in case of nodemon use. The above line dont work in some OS, like debian.
let currentPort = "3001";
for(let param of process.argv){
    if(param.match(/port=[0-9][0-9][0-9][0-9]/g)!== null && param.length==9){
        currentPort = param.split("=")[1];
        break;
    }
}

fastify.register(require('@fastify/static'),{ 
    root: path.join(__dirname)+"/public",
    prefix: '/',
    decorateReply: true
})
fastify.register(require('@fastify/mysql'), {
    connectionString: `mysql://${login.username}:${login.password}@localhost/caddy_project`
})

//route for home page
fastify.get('/', (request, reply) => {
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile("index.html");
})
//routes to handle font, js, css and img assets
fastify.get('/assets/:type/:file', (request, reply) => {
    let file = request.params.file;
    let type = request.params.type;
    const validType = ["js","img","css","font"];
    if(!validType.includes(type)
    &&!fs.existsSync(`public/assets/${type}/${file}`)
    &&!fs.existsSync(`public/assets/${type}/${file.replace(".js",".min.js")}`)
    &&!fs.existsSync(`public/assets/${type}/${file.replace(".css",".min.css")}`)){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    const contentType = type=="font"?"application/x-font-ttf":
    type=="js"?"application/javascript":
    type=="css"?"text/css":
    type=="img"?file.endsWith("ico")?"image/x-icon":file.endsWith("png")?"image/png":file.endsWith("svg")?"image/sgv+xml": "":"";
    const cacheAge = type=="font"?"0":type=="img"?"0":type=="js"?"7890000":type=="css"?"7890000":"0";
    file = fs.existsSync(`public/assets/css/${file.replace('.css','.min.css')}`) ?
    file.replace('.css','.min.css') :
    fs.existsSync(`public/assets/css/${file.replace('.js','.min.js')}`) ?
    file.replace('.js','.min.js') : file;
    if(contentType==""){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    reply.headers({'Content-Type':contentType,'Cache-Control':`max-age=${cacheAge},public`});
    reply.sendFile(`assets/${type}/${file}`);
})
//routes that handle the back of todo
//route to get all todos
fastify.get('/api/getTodo', (request, reply) => {
    fastify.mysql.query(
        'SELECT * from todo order by done_todo, date_todo asc',
        (err, result) => {
            reply.send(err || result)
        }
    )
})
//route to add a todo
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
//route to a todo based on an id
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
//route to a modify a todo based on an id
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
//route to handle to modify only done value based an id
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
//route to handle page not found
fastify.setNotFoundHandler((request, reply) => {
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile("page/404.html");
})

fastify.listen({ port : currentPort }, (err, address) => {
    if (err) throw err;
    console.log(`listening to ${address}`);
})