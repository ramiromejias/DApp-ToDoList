// Importación del contrato inteligente TasksContract
const TasksContract = artifacts.require("TasksContract");

// Conjunto de pruebas unitarias
contract("TasksContract", (accounts) => {
  // Instancia del contrato inteligente desplegado
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  // Verifica que el contrato se haya desplegado correctamente obteniendo su dirección y asegurándose de que no sea nula, indefinida, igual a 0x0 o una cadena vacía
  it("Migrate deployed successfully", async () => {
    const address = await this.tasksContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  // Obtiene el contador de tareas (tasksCounter) desde el contrato y luego obtiene una tarea específica utilizando ese contador. Compara que la información de la tarea obtenida coincida con los valores esperados y que el contador sea igual a 1.
  it("Get tasks list", async () => {
    const tasksCounter = await this.tasksContract.tasksCounter();
    const task = await this.tasksContract.tasks(tasksCounter);

    assert.equal(task.id.toNumber(), tasksCounter.toNumber());
    assert.equal(task.title, "My First Task");
    assert.equal(task.description, "My First Description");
    assert.equal(task.done, false);
    assert.equal(tasksCounter, 1);
  });

  // Crea una nueva tarea utilizando la función createTask del contrato y proporciona un título y una descripción. Verifica que la tarea se haya creado correctamente al comparar el evento emitido (taskEvent) y el contador de tareas.
  it("Task created successfully", async () => {
    const result = await this.tasksContract.createTask(
      "My Second Task",
      "My Second Description"
    );
    const taskEvent = result.logs[0].args;
    const tasksCounter = await this.tasksContract.tasksCounter();

    assert.equal(tasksCounter, 2);
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.title, "My Second Task");
    assert.equal(taskEvent.description, "My Second Description");
    assert.equal(taskEvent.done, false);
  });

  // Cambia el estado "done" de una tarea existente utilizando la función toggleDone del contrato para marcarla como completada. Verifica que la tarea se haya marcado como completada y que el evento emitido refleje este cambio.
  it("Task toggled done", async () => {
    const result = await this.tasksContract.toggleDone(1);
    const taskEvent = result.logs[0].args;
    const task = await this.tasksContract.tasks(1);

    assert.equal(task.done, true);
    assert.equal(taskEvent.id.toNumber(), 1);
    assert.equal(taskEvent.done, true);
  });
});
