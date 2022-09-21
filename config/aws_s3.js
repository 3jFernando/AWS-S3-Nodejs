import {
  S3Client, // conexion
  PutObjectCommand, // crear/actualziar archivos,
  ListObjectsCommand, // obtener todos los archivos
  GetObjectCommand // Obtener un archivo por su key
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import fs from 'fs'

import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_USER_ID_PASSWORD_ACCESS,
  AWS_USER_PASSWORD_ACCESS_SECRET
} from './config.js'

// S3Client -> permite establecer la conexion
const clientS3 = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_USER_ID_PASSWORD_ACCESS,
    secretAccessKey: AWS_USER_PASSWORD_ACCESS_SECRET
  }
});

async function uploadFile(file) {

  /* createReadStream -> permite cojer el file y convertirlo en un stream para
  * luego poder ir partiendolo en partes mas pequeñas e ir subiendolo
  * 
  * tempFilePath -> es una propiedad del file que subimos al servicio a traves de
  * express-fileupload ----> y este es la direccion del archivo que se guardo en 
  * la carpeta temporal en nuestro proyecto
  * 
  */
  const streamFile = fs.createReadStream(file.tempFilePath);

  // configuraciones basicas
  const optionsObjectCommand = {
    Bucket: AWS_BUCKET_NAME, // directorio 
    Key: file.name, // nombre del archivo,
    Body: streamFile // contenido del archivo
  }

  // PutObjectCommand -> para subir el archivos a s3
  const commandFile = new PutObjectCommand(optionsObjectCommand);

  // commandFile -> describe las operaciones
  const result = await clientS3.send(commandFile);
  console.log(result);
}

async function getFiles() {

  const listObjectsCommand = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME
  });

  return await clientS3.send(listObjectsCommand);
}

async function getFileByKey(fileName) {

  const getObjectCommand = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName
  });

  return await clientS3.send(getObjectCommand);
}

async function getAndDownloadFileByKey(fileName) {

  const getObjectCommand = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName
  });

  const result = await clientS3.send(getObjectCommand);
  result.Body.pipe(fs.createWriteStream(`./images/${fileName}`));
}

async function getFileInSignedUrl(fileName) {

  const getObjectCommand = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName
  });

  return await getSignedUrl(
    clientS3,
    getObjectCommand, {
      expiresIn: 3600
    }
  );  
}

export {
  uploadFile,
  getFiles,
  getFileByKey,
  getAndDownloadFileByKey,
  getFileInSignedUrl
}