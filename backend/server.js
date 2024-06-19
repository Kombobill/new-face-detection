const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Clarifai = require('clarifai');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const clarifaiApp = new Clarifai.App({
  apiKey: '6b491abfa9aa4ae896ab9c0c45eb3b58'
});

app.post('/imageurl', (req, res) => {
  clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
