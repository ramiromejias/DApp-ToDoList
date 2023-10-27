// Migración del contrato inteligente TasksContract.sol para su despliegue

// Importación del artefacto (ABI y dirección) del contrato desde "TasksContract.sol"
const TasksContract = artifacts.require("TasksContract.sol");

module.exports = function (deployer) {
  // Utilización del objeto "deployer" para desplegar el contrato en la cadena de bloques
  deployer.deploy(TasksContract);
};
