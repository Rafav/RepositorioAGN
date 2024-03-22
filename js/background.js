// background.js

const url_base='https://repositorio.agn.gob.mx/api/img/image/';


async function descargarYProcesarJSON(url) {
    try {
        let response = await fetch(url); // Descargar el JSON
        let data = await response.json(); // Convertir a objeto JavaScript

        // Asumiendo que el JSON es un arreglo de objetos:
        for (let item of data) {
            if ('idImagenDigitalizada' in item) {
                console.log(url_base+item.idImagenDigitalizada); // Procesa cada idImagenDigitalizada
                chrome.downloads.download({ url: url_base+item.idImagenDigitalizada});

            }
        }
    } catch (error) {
        console.error('Error al descargar o procesar el JSON:', error);
    }
}

// Uso de la función con una URL de ejemplo
descargarYProcesarJSON('https://ejemplo.com/miarchivo.json');


function iterateFilename(url_json) {
    console.log('Al lío');
    chrome.downloads.download({ url: url_json });
   
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'scrapedData') {
        iterateFilename(request.url);
        descargarYProcesarJSON(request.url);
    }
});

