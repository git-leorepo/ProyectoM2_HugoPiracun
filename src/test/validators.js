// validators.js
export function validarEmail(email) {
  if (!email) {
    return 'El email es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email es inválido';
  }
  return null
}

export function queSeaNum (valor){
    return typeof valor === 'number' && !isNaN(valor);
}