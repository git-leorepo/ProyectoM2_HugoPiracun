export {validarEmail, queSeaNum, SQLInjection, caracteresProhibidos}

// validators.js
function validarEmail(email) {
  if (!email) {
    return 'El email es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email es inválido';
  }
  return null
}

function queSeaNum (valor){
    return typeof valor === 'number' && !isNaN(valor);
}

function SQLInjection(valor){
  // Detectar intentos básicos de SQL injection
        const patronesSQL = /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i;
        if (patronesSQL.test(valor)) {            
            return true;            
        }
}

function caracteresProhibidos(valor){
    const caracteresProhibidos = /[<>{}[\]\/\\|;:'"]/;
        if (caracteresProhibidos.test(valor)) {
            return true; 
        }
}
