// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// Definición del contrato inteligente
contract TasksContract {
    uint256 public tasksCounter; // Contador para asignar identificadores únicos a las tareas

    // Estructura de datos para definir una tarea
    struct Task {
        uint256 id; // Identificador único de la tarea
        string title; // Título de la tarea
        string description; // Descripción de la tarea
        bool done; // Estado de finalización de la tarea
        uint256 createdAt; // Marca de tiempo de creación de la tarea
    }

    // Evento emitido cuando se crea una nueva tarea
    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    // Evento emitido cuando se cambia el estado de finalización de una tarea
    event TaskToggledDone(uint256 id, bool done);

    // Mapeo que asigna identificadores a estructuras de tareas
    mapping(uint256 => Task) public tasks;

    // Constructor del contrato que establece el contador a 0 y crea una tarea inicial
    constructor() {
        tasksCounter = 0;
        createTask("My First Task", "My First Description");
    }

    // Función para crear una nueva tarea
    function createTask(
        string memory _title,
        string memory _description
    ) public {
        tasksCounter++; // Incrementa el contador de tareas
        tasks[tasksCounter] = Task(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        // Emite el evento de creación de tarea
        emit TaskCreated(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    // Función para cambiar el estado de finalización de una tarea
    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id]; // Obtiene la tarea del mapeo
        _task.done = !_task.done; // Cambia el estado de finalización
        tasks[_id] = _task; // Actualiza la tarea en el mapeo
        // Emite el evento de cambio de estado de finalización
        emit TaskToggledDone(_id, _task.done);
    }
}
