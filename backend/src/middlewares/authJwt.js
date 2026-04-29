const jwt = require('jsonwebtoken');
const modelUser = require('../models/User');

const verifyJWT = async (req, res, next) => {
  try {
    const authJwt = req.headers['authorization'];

    if (!authJwt) {
      return res.status(403).send({ 
        success: false, 
        message: 'No se proporcionó un token de autenticación' 
      });
    }

    const token = authJwt.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (error, verify) => {
      if (error) {
        return res.status(401).send({ 
          success: false, 
          message: 'Token inválido o expirado' 
        });
      }

      req._id = verify._id;
      const user = await modelUser.findOne({ _id: req._id }, { password: 0 });

      if (!user) {
        return res.status(403).send({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }

      if (token !== user.accessToken) {
        return res.status(403).send({ 
          success: false, 
          message: 'El token no coincide con la sesión activa' 
        });
      }

      next();
    });

  } catch (error) {
    console.error(error);
    return res.status(401).send({ 
      success: false, 
      message: 'No autorizado' 
    });
  }
};

module.exports = verifyJWT;