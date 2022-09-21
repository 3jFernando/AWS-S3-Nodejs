import express from 'express'
import fielUpload from 'express-fileupload'

import {
  uploadFile,
  getFiles,
  getFileByKey, // devulve los metadatos
  getAndDownloadFileByKey,
  getFileInSignedUrl // devuelve la url persigner
} from './config/aws_s3.js'

const app = express();

// normalmente fielUpload -> guarda los archivos en la memoria ram del pc entonces no se ven
// para eso se pueden especificar parametros como useTempFiles y tempFileDir
app.use(fielUpload({
  // poder especificar que guarde los archivos tmp en un directororio del proyecto
  useTempFiles: true, 
  // especificar el directorio
  tempFileDir: './uploads'
}));

app.get("/files", async (req, res) => {

  await getFiles().then(response => {
    res.json({
      "message": "Files in S3",
      "files": response?.Contents
    })
  }).catch(err => {
    res.json({
      "message": "Error",
      "files": err
    })
  });
  

});

app.get("/files/:fileName", async (req, res) => {

  const result = await getFileInSignedUrl(req.params.fileName);
  res.json({ "message": "Files in S3", "url": result })
});

app.get("/files/download/:fileName", async (req, res) => {

  await getAndDownloadFileByKey(req.params.fileName);
  res.json({"message": "Downloaded file to S3",})
});

app.post("/files", async (req, res) => {

   /**
    * fielUpload() -> middleware 
    * 
    * me permite ahora tener en todas las rutas en su propiedad
    * req. -> el files
    * req.files
    */
  
  console.log(req.files);

  const result = await uploadFile(req.files.file);

  res.json({
    "message": "uploaded file",
    "file": result
  })
});

app.listen(3100);
console.log("server listening");