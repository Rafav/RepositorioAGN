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

  function consultarValor(clave) {
    
    let instrumentosAGN = {
      'Audiovisuales': 'au',
      'Cartogr\u00e1ficos': 'ca',
      'Iconogr\u00e1ficos': 'ic',
      'Textuales': 'te',
      'Ficheros': 'fi'
    };

    if (clave in instrumentosAGN) {
      return instrumentosAGN[clave];
    } else {
      alert(" No encuentro la clave del \u00e1rbol de contenidos");
      return null;
    }
  }


  function createURL(idInstrumento, identificador) {

    // Separa la parte por guiones bajos '_'
    const subParts = identificador.split('_');

    // Construye la URL basada en la longitud de subParts
    let url;
    if (subParts.length === 3) {
      url = `https://repositorio.agn.gob.mx/api/img?folioAnio=${subParts[0]}&idFicha=${subParts[1]}&folioInstrumento=${subParts[2]}&typeInst=`
        + idInstrumento;

    } else if (subParts.length === 1) {

      //ES UNA UNIDAD INSTRUMENTAL
      url = `https://repositorio.agn.gob.mx/api/img/unidadInstalacion/` +
        idInstrumento + `/${subParts[0]}`;
    } else {
      alert('No es posible descargar. Ver log en la consola');
      console.log('Problema con el identificador, la longitud de subParts no es ni 1 ni 3');
    }
    return url;
  }

  let existeBoton = !!document.querySelector('.menuBtnSeleccion'); // Verifica si existe algún botón con la clase 'menuBtnSeleccion'

  if (existeBoton) {

    //Buscamos el Tipo de instrumento que se ha seleccionado en el árbol
    //Al menos hay que seleccionar uno, no se puede usar la raíz
    const tipoInstrumento = document.querySelectorAll('.ruta a');
    if (tipoInstrumento.length > 1) {
      console.log(tipoInstrumento[1].textContent);
      const idInstrumento = consultarValor(tipoInstrumento[1].textContent);
      console.log(idInstrumento);

      //Si existe en nuestra lista de fondos seguimos buscando. Puede ser que añadan tipos de Fondo en un futuro


      // Selecciona todos los elementos que tienen aria-selected="true"
      const selectedElements = document.querySelectorAll('[aria-selected="true"]');

      // Verifica si hay elementos seleccionados
      if (selectedElements.length > 0) {
        // Recorre cada elemento seleccionado
        selectedElements.forEach(element => {
          // Obtiene el valor del atributo 'id'
          const idValue = element.getAttribute('id');
          if (idValue) { // Verifica si el valor de 'id' existe
            // Separa el valor de 'id' por guiones '-'
            const parts = idValue.split('-');


            const instrumento = parts.slice(1, 3)[1]; // Al final aparecen las  siglas del instrumento
            console.log(instrumento);

            if ((instrumento == "FO") || (instrumento == "AR") || (instrumento == "IN")) {
              alert('No se puede descargar. Seleccione un subnivel del \u00e1rbol de navegaci\u00f3n');
            }
            else {

              const relevantPart = parts.slice(1, 3)[0]; // Asume que necesitamos la  primera parte relevante

              let url;

              url = createURL(idInstrumento, relevantPart);

              if (url) {
                console.log(url); // O cualquier otra operación que necesites realizar  con la URL
                chrome.runtime.sendMessage({ action: 'scrapedData', url });

              }
            }
          }
          else {
            alert('No se puede descargar. Seleccione un subnivel del \u00e1rbol de navegaci\u00f3n');
          }
        });
      }
      else {
        alert('Seleccione un subnivel del \u00e1rbol de navegaci\u00f3n');
      }
    } else {
      alert('Es necesario seleccionar un tipo de instrumento');
    }
  }
  else {
    alert('No existe galer\u00eda de im\u00e1genes');
  }
}