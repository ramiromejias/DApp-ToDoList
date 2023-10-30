App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTasks();
  },
  // Función para cargar Web3
  loadWeb3: async () => {
    // Verifica si la ventana del navegador tiene habilitada la extensión Ethereum (como MetaMask)
    if (window.ethereum) {
      // Asigna el proveedor Web3 de la ventana del navegador a la variable App.web3Provider
      App.web3Provider = window.ethereum;
      // Solicita al usuario la autorización para acceder a su cuenta Ethereum
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Almacena en el almacenamiento local que el usuario está conectado a Ethereum
      localStorage.setItem("eth_connected", "true");
    } else {
      console.log(
        // Si no se encuentra una extensión Ethereum en el navegador, muestra un mensaje en la consola
        "No se encuentra la propiedad ethereum. Prueba instalando MetaMask"
      );
    }
  },
  loadAccount: async () => {
    // Solicita acceso a las cuentas del usuario a través de la API de Ethereum en el navegador.
    // Esta función utiliza el método "eth_requestAccounts" proporcionado por la ventana Ethereum.
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // Verifica si se obtuvo al menos una cuenta.
      if (accounts.length > 0) {
        // Asigna la primera cuenta obtenida como la cuenta actual de la aplicación.
        App.account = accounts[0];
        console.log("Cuenta cargada:", App.account);
      } else {
        console.error("No se obtuvieron cuentas.");
      }
    } catch (error) {
      // Manejo de errores en caso de que el usuario no dé permiso o ocurra algún otro problema.
      console.error("Error al cargar la cuenta:", error);
    }
  },
  loadContract: async () => {
    try {
      // Carga el archivo JSON que contiene la información del contrato.
      const res = await fetch("TasksContract.json");
      const tasksContractJSON = await res.json();
      // Crea una instancia del contrato utilizando TruffleContract y proporciona su definición JSON.
      App.contracts.TasksContract = TruffleContract(tasksContractJSON);
      // Establece el proveedor web3 para la instancia del contrato.
      App.contracts.TasksContract.setProvider(App.web3Provider);
      // Obtiene la instancia desplegada del contrato para interactuar con él.
      App.tasksContract = await App.contracts.TasksContract.deployed();
    } catch (error) {
      // Captura y registra cualquier error que ocurra durante el proceso.
      console.error(error);
    }
  },
  render: async () => {
    // Actualiza el elemento HTML con el ID "account" con la dirección de cuenta actual.
    // La propiedad "account" debe haber sido previamente cargada en otro lugar de tu código.
    document.getElementById("account").innerText = App.account;
    // Actualiza el contenido del elemento HTML con el ID "connect" para eliminar cualquier texto visible.
    // Esto podría indicar que la conexión o autenticación se ha completado.
    document.getElementById("connect").innerText = "";
  },
  renderTasks: async () => {
    // Obtiene el contador de tareas desde el contrato y espera la respuesta asincrónicamente.
    const tasksCounter = await App.tasksContract.tasksCounter();
    const taskCounterNumber = tasksCounter.toNumber();

    // String para almacenar el HTML que representa las tarjetas de tareas.
    let html = "";

    // Itera a través de las tareas almacenadas en el contrato.
    for (let i = 1; i <= taskCounterNumber; i++) {
      // Obtiene los detalles de la tarea individual desde el contrato.
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0].toNumber(); // ID de la tarea.
      const taskTitle = task[1]; // Título de la tarea.
      const taskDescription = task[2]; // Descripción de la tarea.
      const taskDone = task[3]; // Estado de finalización de la tarea.
      const taskCreatedAt = task[4]; // Marca de tiempo de creación de la tarea.

      // Crea una tarjeta HTML para mostrar la tarea.
      let taskElement = `<div class="card bg-dark rounded-0 mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="text-white">${taskTitle}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
        taskDone === true && "checked"
      }>
          </div>
        </div>
        <div class="card-body">
          <span class="text-white">${taskDescription}</span>
          <p class="text-secondary">Created at: ${new Date(
            taskCreatedAt * 1000
          ).toLocaleString()}</p>
          </label>
        </div>
      </div>`;
      html += taskElement; // Agrega la tarjeta de tarea al HTML.
    }

    // Inserta el HTML generado en el elemento con ID "tasksList".
    document.querySelector("#tasksList").innerHTML = html;
  },
  createTask: async (title, description) => {
    try {
      // Intenta crear una nueva tarea llamando a la función "createTask" del contrato.
      // Proporciona el título y la descripción como parámetros y la cuenta actual como remitente.
      const result = await App.tasksContract.createTask(title, description, {
        from: App.account,
      });
      // Registra los argumentos del primer evento "TaskCreated" en la consola.
      console.log(result.logs[0].args);
      // Restablece el formulario de la tarea para borrar los campos.
      document.getElementById("taskForm").reset();
      // Recarga la página para reflejar los cambios después de crear la tarea.
      window.location.reload();
    } catch (error) {
      // Manejo de errores en caso de que la creación de la tarea falle.
      console.error(error);
    }
  },
  toggleDone: async (element) => {
    // Obtiene el ID de tarea del atributo 'data-id' del elemento pasado como parámetro.
    const taskId = element.dataset.id;
    // Llama al método 'toggleDone' en el contrato de tareas, para cambiar el estado de una tarea.
    // Se espera a que la transacción se complete antes de continuar.
    try {
      await App.tasksContract.toggleDone(taskId, {
        from: App.account, // Utiliza la cuenta actual de la aplicación como remitente.
      });
      // Recarga la ventana actual para reflejar los cambios actualizados en la tarea.
      window.location.reload();
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
    }
  },
};
