document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const message = { action: 'scrapePage' };

      // Enviar un mensaje al script de contenido (content.js)
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: startContentScript
      });
    });
  });
});

function startContentScript() {
  // Este código se ejecutará en el contexto de la pestaña activa
  // Realiza el scraping aquí y devuelve los resultados

  // Selecciona el elemento <input> por su id
  const inputElement = document.querySelector('#sharingToken');

  if (inputElement) {
    // Obtiene el valor del atributo value
    const inputValue = inputElement.value;

    // Hacer algo con inputValue, por ejemplo, imprimir en consola
    console.log(inputValue);


    //localizamos el número de archivos a descargar
    // Select the .fileinfo element
    let fileInfo = document.querySelector('td.filesummary .fileinfo');

    // Get the text content of the .fileinfo element
    let fileInfoText = fileInfo.textContent; // e.g., "4 archivos"

    // Use a regular expression to find the first number in the text
    let matches = fileInfoText.match(/\d+/);

    // Parse the number from the result and make sure it's an integer
    let numberOfFiles = matches ? parseInt(matches[0], 10) : null;

    alert(numberOfFiles); // This will log the number, e.g., 4


    // Select only the first <tr> element with 'data-file' attribute
    const trElement = document.querySelector('tr[data-file]');



    // Show an alert with the value of 'data-file' attribute of the first <tr> element
    if (trElement) { // Check if the element exists
      let baseFilename = trElement.getAttribute('data-file');
      let path = trElement.getAttribute('data-path');
      alert('Descargamos ' + trElement.getAttribute('data-file') + ' con path ' + trElement.getAttribute('data-path'));
      chrome.runtime.sendMessage({ action: 'scrapedData', inputValue, path, baseFilename, numberOfFiles });

    } else {
      alert('No se encontró ningún elemento <tr> con atributo data-file');
    }

  } else {
    console.log('Elemento no encontrado');
  }


}
