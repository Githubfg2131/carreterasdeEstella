```php
<?php
session_start();

$host = "localhost";
$dbname = "00fer";
$userdb = "root";
$passdb = "";

// Conexion segura PDO
try {
    $conexion = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $userdb,
        $passdb
    );

    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {

    die("Error de conexion: " . $e->getMessage());
}


// Comprobar si llegan datos
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario = trim($_POST["user"]);
    $password = trim($_POST["pass"]);


    // Consulta segura anti SQL Injection
    $sql = "SELECT * FROM usuarios WHERE user = :usuario AND pass = :password LIMIT 1";

    $stmt = $conexion->prepare($sql);

    $stmt->bindParam(':usuario', $usuario);
    $stmt->bindParam(':password', $password);

    $stmt->execute();

    // Verificar si existe
    if ($stmt->rowCount() == 1) {

        $_SESSION["usuario"] = $usuario;

        // Redireccion a pagina privada
        header("Location: index10.html");
        exit();

    } else {

        echo "
        <style>
            body{
                background:#111;
                color:white;
                font-family:Arial;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
            }

            .error{
                background:#1f1f1f;
                padding:30px;
                border-radius:10px;
                text-align:center;
                box-shadow:0 0 20px rgba(0,0,0,0.5);
            }

            a{
                color:#4da3ff;
                text-decoration:none;
            }
        </style>

        <div class='error'>
            <h2>Acceso denegado</h2>
            <p>Usuario o contraseña incorrectos</p>
            <br>
            <a href='index2.html'>Volver</a>
        </div>
        ";
    }
}
?>
```
