const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const  {  graphqlHTTP } = require('express-graphql');


const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth')
const { clearImage } = require('./util/file')


const cors = require('cors');
const { connect } = require('http2');
const { init, schema } = require('./models/post');

const app = express();
app.use(cors());


const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, uuidv4() + extension)
    }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

app.use(auth)

app.put('/post-image' , (req, res, next) =>{
  if(!req.isAuth){
    throw new Error('Not AuthenticatedS')
  }
  if(!req.file){
    return res.status(200).json({message: "No File Provided"});
  }
  if(req.body.oldPath){
    clearImage(req.body.oldPath)
  }
  return res.status(201).json({message: "File is Saved" , filePath: req.file.path });
});

app.use('/graphql' , graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err){
    if(!err.originalError){
      return err;
    }
    const data = err.originalError.data; 
    const message = err.message || 'An Error Occured'
    const code = err.originalError.code || 500
    return { message: message, status: code, data: data}
  }
}));


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://kimhanjin:75kYKRBxracYLrj6@cluster0.0bms1.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
