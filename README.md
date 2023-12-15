<h2>Require</h2> 
nodejs, npm, caddy, mysql server, (npx optional, require only for nodemon)
<h2>Instalation</h2>
<strong>to install the require node package for todo_back, inside the folder todo_back do</strong><br> 
[shell] \> npm i<br>
<strong>don't forget to put your mysql login in todo_back/index.js and todo_back/mysql/database.js</strong>
<h2>Running website</h2>
<strong>to run caddy server</strong><br>
[shell] \> caddy start <br>
<strong>to run all node server including the init of database, inside todo_back folder</strong><br>
[shell] \> npm run start_todo<br>
or with nodemon<br>
[shell] \> npm run start_todo_nodemon<br>
<strong>to run all node server without the init of database, inside todo_back folder</strong><br>
[shell] \> npm run run_todo<br>
or with nodemon<br>
[shell] \> npm run run_todo_nodemon<br><br>
<strong>if the lines not work, use the step below</strong><br>
<strong>to init the database, go to folder todo_back and execute </strong><br>
[shell] \> node mysql/database.js<br>
<strong>to run nodejs servers, go to folder todo_back and execute in three shell windows</strong><br>
[shell 1] \> node index.js port=4001 <br>
[shell 2] \> node index.js port=4002 <br>
[shell 3] \> node index.js port=4003 <br>
<strong>or with nodemon</strong><br>
[shell 1] \> npx nodemon -e js -i public/* index.js port=4001 <br>
[shell 2] \> npx nodemon -e js -i public/* index.js port=4002 <br>
[shell 3] \> npx nodemon -e js -i public/* index.js port=4003 <br>
<h2>Adress</h2>
portefolio : https://portefolio.localhost<br>
todo : https://todo.localhost