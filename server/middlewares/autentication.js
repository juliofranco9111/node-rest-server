const jwt = require('jsonwebtoken');

//===========
//Verificar Token
//==========

let verificaToken = (req, res, next) => {


   //.get accede a los headers
   let token = req.get('token');

   jwt.verify(token, process.env.SEED, (err, decoded)=>{

      if(err) {
         return res.status(401).json({
            ok:false,
            err:{
               message: 'Token inválido'
            }
         });
      };

      req.usuario = decoded.usuario;

      //recordar llamar el next
      next();

   });


};


//===========
//Verificar role admin
//==========
let verificaAdminRole = (req, res, next) => {

   let usuario = req.usuario;

   let role = usuario.role;

   if( role === 'ADMIN_ROLE'){
      
      next();
      
      
   }else{
      return res.status(401).json({
         ok:false,
         err:{
            message: 'Usuario sin privilegios de administrador'
         }
      });
   }
   
   
   };
   

module.exports = {
   verificaToken,
   verificaAdminRole
}