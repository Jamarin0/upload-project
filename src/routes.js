const routes = require("express").Router();
const multer = require("multer");
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const multerConfig = require("./config/multer");

const Post = require("./models/Post");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imagePath = req.file.path;
    const imageExtension = path.extname(imagePath);

    const image = await loadImage(imagePath);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const watermark = await loadImage('pri.png');

    const watermarkX = canvas.width - watermark.width - 10;
    const watermarkY = canvas.height - watermark.height - 10;

    ctx.drawImage(watermark, watermarkX, watermarkY, watermark.width, watermark.height);
    const processedImage = canvas.toBuffer();
    
    res.setHeader('Content-Type', `image/${imageExtension.slice(1)}`);


    res.send(processedImage);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});


routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = routes;