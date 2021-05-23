const routes = require('express').Router();

routes.get("/", (req, res) => {
    return res.json({ hello: "Hello World"});
});

module.exports = routes;