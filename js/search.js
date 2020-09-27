document.getElementById("btn").addEventListener("click", search);

function search() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    let relevancia = document.getElementById("select").value;
    if(!palabraBuscar) {
        alert("Introduce una palabra en el buscador")
        return;
    }
    let palabraDecodificada = removeAccents(palabraBuscar.replace(/ /g,"_"));
    let urlBusqueda = 'buscador.php?consulta=' + palabraDecodificada + "&ordenar=" + relevancia;
    get(urlBusqueda).then(function(response) {
        let respuestaSinHtml = eliminarHtml(response);
        json = JSON.parse(respuestaSinHtml);
        if (relevancia == "Size Asc") {
            var oJSON = sortJSON(json.query.search, 'size', 'asc');
        }
        if (relevancia == "Size Desc") {
            var oJSON = sortJSON(json.query.search, 'size', 'desc');
        }
        if (!document.getElementById("table")) {
            var b = document.createElement("table");
            b.setAttribute("id", "table");
            document.getElementById("resultados").appendChild(b);
        }
        document.getElementById("table").innerHTML = '<tbody><tr><th scope="col">Id</th><th scope="col">Título</th><th scope="col">Descripción</th><th scope="col">Fecha</th><th scope="col">Tamaño</th><th scope="col">Url</th></tr></tbody>';
        let i = 0;
        while((json.query.search) && (i<10) ) {
            let id = json.query.search[i].pageid;
            let title = json.query.search[i].title;
            let description = json.query.search[i].snippet + "...";
            let timestamp = json.query.search[i].timestamp;
            let size = json.query.search[i].size;
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

//var oJSON = sortJSON(elJSON, 'num', 'asc');

function eliminarHtml(cadena) {
    return cadena.replace(/<\/?[^>]+>/gi, '');
}