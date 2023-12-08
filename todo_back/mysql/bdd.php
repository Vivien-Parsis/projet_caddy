<?php
    require('private/login.php');
    //replace by yours mysql login
    //$username = "";
    //$password = "";
    //$servername = "";
    //$port = 3306;
    try {
        $conn = new PDO("mysql:host=$servername;port=$port", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $bdd = file_get_contents('todo_back/mysql/bdd.sql');
        $stmt = $conn->exec($bdd);
        echo "successfuly load the mysql database\n";
    } catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
        return "error sql";
    }
?>