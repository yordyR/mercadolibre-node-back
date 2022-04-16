const itemsRouter = require('./items.router');

function routerApi(app) {
 app.use('/api/items', itemsRouter);
}

module.exports = routerApi;
