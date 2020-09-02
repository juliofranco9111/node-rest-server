//el process es un objeto global que corre en todos los enviroments

//-------Puerto -------//

process.env.PORT = process.env.PORT || 3000;

//-------ENTORNO-------//
//si existe node_env entonces estoy en produccion. si no estoy en dev
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//------vencimiento token-------//
//seg * minutos * horas * dias = 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//-------seed token-------//
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//----URI mongo -------//

let urlDB;

if (process.env.NODE_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/coffee';
} else {
   urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//------Google client_id-------//

process.env.CLIENT_ID = process.env.CLIENT_ID || '846494435511-ntd2c5muq9be69rdh7ioirhh3ck0um6e.apps.googleusercontent.com';