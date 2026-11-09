
<?php
session_start();

if(!isset($_SESSION["usuario"])){

    header("Location: index2.html");
    exit();
}
?>

