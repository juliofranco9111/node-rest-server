//el process es un objeto global que corre en todos los enviroments

//----Puerto -------//

process.env.PORT = process.env.PORT || 3000;

//----ENTORNO-------//
//si existe node_env entonces estoy en produccion. si no estoy en dev
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//----URI mongo -------//

let urlDB;

if(!process.env.NODE_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/coffee';
}else{
   urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
