const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const config = require('config');
const path = require('path');
const fileupload = require('express-fileupload');

const app = express();

const PORT = config.get('PORT') || 5000;

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: config.get("tempFilePath")
}));
app.use(express.json());
app.use(express.static(path.join('./', 'static')));
app.use('/api/auth', routes.auth);
app.use('/api/file', routes.file);
app.use('/api/user', routes.user);

const start = async () => {
    try {
        await mongoose.connect(config.get('Mongo_Uri'), {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
            .then(()=> console.log('Authentication done!'))
            .catch(()=> {throw new Error('Authentication failed.')});
        app.listen(PORT, () => console.log(`Server has been started on port: ${PORT}`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();