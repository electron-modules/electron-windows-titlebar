const proxy = new Proxy({}, {
  get: (target, prop) => prop,
});

module.exports = proxy;
module.exports.default = proxy;
