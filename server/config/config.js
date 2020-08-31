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
   urlDB = 'mongodb+srv://juliofranco9111:i9VIofpeTA16iL58@cluster0.hixjh.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
