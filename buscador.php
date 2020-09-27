<?php
    if(isset($_GET['consulta'])) {
        $consulta = $_GET['consulta'];

        $URL_WIKIPEDIA = "https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=$consulta&srprop=size|timestamp|snippet";
        
        $opciones = array('http' =>
            array(
                'method'  => 'GET',
                'header'  => ['Content-type: application/json', 'Accept: application/json']
            )
        );
        
        $contexto = stream_context_create($opciones);
        
        $resultado = file_get_contents($URL_WIKIPEDIA, false, $contexto);
        echo $resultado;
    } else{
        echo 'error';
    }
?>