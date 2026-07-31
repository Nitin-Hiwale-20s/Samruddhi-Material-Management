const mongoose = require("mongoose");

// Allowed collection/module names. Add new modules here.
const ALLOWED_MODULES = [
  "lanes",
  "equipment",
  "inventory",
  "installations",
  "cabletracking",
  "dailylogs",
  "workstatus",
];

const modelCache = {};

// Generic flexible schema -- each module can have its own set of fields,
// defined on the frontend (see frontend/src/config/modulesConfig.js).
// strict:false lets us store whatever fields the frontend form sends.
function getModel(moduleName) {
  const name = String(moduleName).toLowerCase();

  if (!ALLOWED_MODULES.includes(name)) {
    return null;
  }

  if (modelCache[name]) return modelCache[name];

  const schema = new mongoose.Schema(
    {},
    { strict: false, timestamps: true, collection: name }
  );

  const model = mongoose.model(
    name.charAt(0).toUpperCase() + name.slice(1),
    schema
  );
  modelCache[name] = model;
  return model;
}

module.exports = { getModel, ALLOWED_MODULES };
