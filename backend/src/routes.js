const routes = require('express').Router();
const multer = require('multer');


routes.post("/posts", multer().single('file'), (req, res) => {
    console.log(req.file);
    
    return res.json({ hello: "Hello World"});
});

module.exports = routes;