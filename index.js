//index.js

const storage = require('@google-cloud/storage')();
const gm = require('gm').subClass({imageMagick: true});

const bucket = "source-bucket.example.com";
const width = 50
const height = 50
const option = "!"
const quality = 90

exports.main = (req, res) => {
  const filename = req.query.f

  if(!filename) {
    res.sendStatus(500).send("No file specified");;
    return;
  }

  const file = storage.bucket(bucket).file(filename);

  let stream = file.createReadStream()

  stream.on('error', function(err) {
    console.error(err);
    res.sendStatus(err.code).end(err);
  });

  gm(stream)
    .resize(width, height, option)
    .quality(quality)
    .stream()
    .pipe(res);

  console.log('Served: ' + filename );
}