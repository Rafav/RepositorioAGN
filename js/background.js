// background.js

const url_base = "https://cloud.agn.gob.mx/nextcloud/index.php/s/";
const url_path = "/download?path=";
const url_files = "&files=";

function padNumber(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function downloadFile(inputValue, path, prefix, numberPart, suffix, extension, i, iterations) {
    let number = parseInt(numberPart, 10);
    let newFilename;
    if (i % 2 === 0) {
        newFilename = `${prefix}${padNumber(number, numberPart.length)}V${extension}`;
        number++;
    } else {
        newFilename = `${prefix}${padNumber(number, numberPart.length)}F${extension}`;
    }
    let url_descargar = url_base + inputValue + url_path + path + url_files + newFilename;
    console.log(url_descargar);
    chrome.downloads.download({ url: url_descargar });

    numberPart = padNumber(number, numberPart.length);  // Prepara para la próxima iteración

    if (i < iterations) {
        // Llama a sí misma con un retraso de 10 segundos
        setTimeout(() => {
            downloadFile(inputValue, path, prefix, numberPart, suffix, extension, i + 1, iterations);
        }, 10000);
    }
}

function iterateFilename(inputValue, path, baseFilename, iterations) {
    console.log('Al lío, iteramos' + iterations);

    let matches = baseFilename.match(/(.*_)(\d+)(F)(\.[^.]+)$/);
    if (!matches) {
        console.error('Formato de archivo no reconocido:', baseFilename);
        return;
    }

    let prefix = matches[1];
    let numberPart = matches[2];
    let suffix = matches[3];
    let extension = matches[4];

    // Comienza el proceso de descarga
    downloadFile(inputValue, path, prefix, numberPart, suffix, extension, 1, iterations);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'scrapedData') {
        iterateFilename(request.inputValue, request.path, request.baseFilename, request.numberOfFiles);
    }
});

