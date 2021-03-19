const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

function _parseFilter(query, allowedFields) {
  const dbQuery = {};

  for (const field in query) {
    const fieldTrimmed = field.trim();

    if (!allowedFields.includes(fieldTrimmed)) continue;

    dbQuery[fieldTrimmed] = query[field];
  }

  return dbQuery;
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
  parseFilter = true,
  parseProjection = true,
  parseOptions = true,
  allowedFields
}) => (req, res, next) => {
  const query = req.query;

  req.dbQuery = {
    filter: parseFilter ? _parseFilter(query, allowedFields) : null,
    projection: parseProjection ? _parseProjection(query, allowedFields) : null,
    options: parseOptions ? _parseOptions(query, allowedFields) : null
  }

  next();
}
