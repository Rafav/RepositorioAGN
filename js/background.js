// background.js

const url_base='https://repositorio.agn.gob.mx/api/img/image/';


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function descargarYProcesarJSON(url) {
    try {
        let response = await fetch(url); // Descargar el JSON
        let data = await response.json(); // Convertir a objeto JavaScript

        // Asumiendo que el JSON es un arreglo de objetos:

        for (let item of data) {
            if ('idImagenDigitalizada' in item) {
                console.log(url_base+item.idImagenDigitalizada); // Procesa cada idImagenDigitalizada
                chrome.downloads.download({ url: url_base+item.idImagenDigitalizada});
                await delay(5000);

            }
        }
    } catch (error) {
        console.error('Error al descargar o procesar el JSON:', error);
    }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'scrapedData') {
        descargarYProcesarJSON(request.url);
    }
});

