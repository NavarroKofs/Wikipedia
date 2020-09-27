<?php
    if(isset($_GET['consulta'])) {
        $consulta = $_GET['consulta'];

        if(isset($_GET['ordenar'])) {
            if($_GET['ordenar'] == "Relevancia"){
                $ordenar = "relevance";
            }
            if($_GET['ordenar'] == "Ascendente"){
                $ordenar = "last_edit_asc";
            }
            if($_GET['ordenar'] == "Descendente") {
                $ordenar = "last_edit_desc";
            } else {
                $ordenar = "none";
            }
        } else {
            $ordenar = "none";
        }

        if($ordenar == "none") {
            $URL_WIKIPEDIA = "https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=$consulta&srprop=size|timestamp|snippet";
        } else {
            $URL_WIKIPEDIA = "https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=$consulta&srprop=size|timestamp|snippet&srsort=$ordenar";
        }
        
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