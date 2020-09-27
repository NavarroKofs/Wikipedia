var json;

document.getElementById("btn").addEventListener("click", search);
document.getElementById("filtros").style.visibility = "hidden";

function ordenar() {
    let valores = JSON.parse(JSON.stringify(json));
    let relevancia = document.getElementById("select").value;
    verificarRelevancia(relevancia, valores);
    imprimirTabla(valores);
}

function imprimirTabla(valores) {
    if (!document.getElementById("table")) {
        var b = document.createElement("table");
        b.setAttribute("id", "table");
        document.getElementById("resultados").appendChild(b);
    }
    document.getElementById("table").innerHTML = '<tbody><tr><th scope="col">Id</th><th scope="col">Título</th><th scope="col">Descripción</th><th scope="col">Fecha</th><th scope="col">Tamaño</th><th scope="col">Url</th></tr></tbody>';
    let i = 0;
    while((valores.query.search) && (i<10) ) {
        let id = valores.query.search[i].pageid;
        let title = valores.query.search[i].title;
        let description = valores.query.search[i].snippet + "...";
        let timestamp = valores.query.search[i].timestamp;
        let size = valores.query.search[i].size;
        let url = "https://es.wikipedia.org/wiki/" + title;
        let tr = document.createElement('TR');
        tr.appendChild(generarColumna(id, "id"));
        tr.appendChild(generarColumna(title, "title"));
        tr.appendChild(generarColumna(description, "description"));
        tr.appendChild(generarColumna(timestamp, "fecha"));
        tr.appendChild(generarColumna(size, "size"));
        var node = document.createElement("A");
        var textnode = document.createTextNode(url);
        node.appendChild(textnode, "url");
        node.setAttribute("href", url)
        tr.appendChild(node);
        document.getElementById("table").appendChild(tr);
        i++;
    }
}

function search() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    if(!palabraBuscar) {
        alert("Introduce una palabra en el buscador")
        return;
    }
    let palabraDecodificada = removeAccents(palabraBuscar.replace(/ /g,"_"));
    let urlBusqueda = 'buscador.php?consulta=' + palabraDecodificada;
    get(urlBusqueda).then(function(response) {
        let respuestaSinHtml = eliminarHtml(response);
        json = JSON.parse(respuestaSinHtml);
        ordenar();
        document.getElementById("filtros").style.visibility = "visible";
        document.getElementById("select").addEventListener("change", ordenar);
        
    }, function(error) {
        alert("Se ha producido un error, intente más tarde.")
    })
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function generarColumna(valor, col) {
    var td = document.createElement('TD');
    td.setAttribute("class", col);
    td.appendChild(document.createTextNode(valor));
    return td;
}

function get(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
        reject(Error("Network Error"));
        };
        req.send();
    });
}

function verificarRelevancia(relevancia, valores) {
    if (relevancia == "Size Asc") {
        sortJSON(valores.query.search, 'size', 'asc');
    }
    if (relevancia == "Size Desc") {
        sortJSON(valores.query.search, 'size', 'desc');
    }
    if(relevancia == "Fecha Asc") {
        sortJSON(valores.query.search, 'timestamp', 'asc');
    }
    if(relevancia == "Fecha Desc") {
        sortJSON(valores.query.search, 'timestamp', 'desc');
    }
}

function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        let x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

function eliminarHtml(cadena) {
    return cadena.replace(/<\/?[^>]+>/gi, '');
}