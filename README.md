<h2>Require</h2> 
nodejs, npm, caddy, mysql server, (npx optional, require only for nodemon)
<h2>Instalation</h2>
<strong>to install the require node package for todo_back, inside the folder todo_back do</strong><br> 
[shell] \> npm i<br>
<strong>to init the database inside todo_back (don't forget to put your own mysql login in todo_back/mysql/database.js and in todo_back/index.js)</strong><br>
[shell] \> node mysql/database.js <br>
<h2>Running website</h2>
<strong>to run caddy server</strong><br>
[shell] \> caddy start <br>
<strong>to run all node server, inside todo_back folder</strong><br>
\> npm run todo<br>
or with nodemon<br>
\> npm run todo_nodemon<br>
<strong>if the lines not work, use the step below</strong><br>
<strong>to run nodejs servers, go to folder todo_back and execute in three shell windows</strong><br>
[shell 1] \> node index.js port=4001 <br>
[shell 2] \> node index.js port=4002 <br>
[shell 3] \> node index.js port=4003 <br>
<strong>or with nodemon</strong><br>
[shell 1] \> npx nodemon -e js -i public/* index.js port=4001 <br>
[shell 2] \> npx nodemon -e js index.js port=4002 <br>
[shell 3] \> npx nodemon -e js index.js port=4003 <br>
<h2>Adress</h2>
portefolio : https://portefolio.localhost<br>
todo : https://todo.localhost