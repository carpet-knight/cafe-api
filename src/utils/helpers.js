function getSchemaFields(schema, ignoreFields = ['__v']) {
  const fields = [];

  schema.eachPath(path => {
    if (ignoreFields.includes(path)) return;

    fields.push(path);
  });

  return fields;
}

module.exports = {
  getSchemaFields
}