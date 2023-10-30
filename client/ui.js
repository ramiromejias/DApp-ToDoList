/**
 * Inicialización
 */
// Se espera a que el DOM termine de cargarse antes de ejecutar cualquier código
document.addEventListener("DOMContentLoaded", () => {
  // Verifica si hay un indicador en el almacenamiento local que indique que Ethereum está conectado
  if (localStorage.getItem("eth_connected") == "true") {
    // Si está conectado, inicia la aplicación
    App.init();
  }
});

/**
 * Formulario de tarea
 */
const taskForm = document.querySelector("#taskForm");

// Se agrega un evento al enviar el formulario
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita el comportamiento por defecto de envío del formulario
  // Obtiene los valores del título y descripción de la tarea desde el formulario
  const title = taskForm["title"].value;
  const description = taskForm["description"].value;
  // Llama a la función 'createTask' de la aplicación con los valores obtenidos
  App.createTask(title, description);
});

/**
 * Conexión
 */
const connectLink = document.querySelector("#connect");

// Se agrega un evento al hacer clic en el enlace de conexión
connectLink.addEventListener("click", () => {
  // Inicia la aplicación (esto podría estar destinado a conectar con Ethereum)
  App.init();
});

/**
 * Cambio de cuenta
 */
// Se agrega un controlador para el evento de cambio de cuentas en la red Ethereum
window.ethereum.on("accountsChanged", (accounts) => {
  // Si no hay cuentas disponibles (el usuario desconectó su billetera)
  if (accounts.length === 0) {
    // Actualiza el indicador de conexión en el almacenamiento local y recarga la página
    localStorage.setItem("eth_connected", "false");
    window.location.reload();
  }
});
