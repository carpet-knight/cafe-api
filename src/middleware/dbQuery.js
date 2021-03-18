const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

function _parseQuery(query, mapTypes, allowedFields) {
  const dbQuery = {};

  for (const field in query) {
    const fieldTrimmed = field.trim();

    if (!allowedFields.includes(fieldTrimmed)) continue;

    dbQuery[fieldTrimmed] = query[field];
  }

  if (!mapTypes) return dbQuery;

  // mapping types to values
  for (const [field, type] of Object.entries(mapTypes)) {
    const value = dbQuery[field];

    if (!value) return;

    if (typeof value === 'object') {
      for (const [f, v] of Object.entries(value)) {
        value[f] = type(v);
      }
    } else {
      dbQuery[field] = type(value);
    }

    return dbQuery;
  }
}

function _parseProjection(query, allowedFields) {
  const projection = {};

  query.fields?.split(',').forEach(field => {
    field = field.trim();

    if (!field || !allowedFields.includes(field)) return;

    projection[field] = 1;
  });

  return Object.keys(projection).length ? projection : null;
}

function _parseOptions(query, allowedFields) {
  const options = {
    skip: query.offset || DEFAULT_OFFSET,
    limit: query.limit || DEFAULT_LIMIT
  };

  const sort = {};

  query.sort?.split(',').forEach(field => {
    field = field.trim();
    let asc = true;

    if (!field) return;

    switch (field[0]) {
      case '-':
        asc = false;
      case '+':
        field = field.slice(1);
        break;
    }

    if (!allowedFields.includes(field)) return;

    sort[field] = asc ? 1 : -1;
  });

  options.sort = sort;

  return options;
}

module.exports = ({
  parseQuery = true,
  parseProjection = true,
  parseOptions = true,
  mapTypes = null,
  allowedFields
}) => (req, res, next) => {
  const query = req.query;

  req.dbQuery = {
    query: parseQuery ? _parseQuery(query, mapTypes, allowedFields) : null,
    projection: parseProjection ? _parseProjection(query, allowedFields) : null,
    options: parseOptions ? _parseOptions(query, allowedFields) : null
  }

  next();
}
