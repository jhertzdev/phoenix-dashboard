const timeAgo = fechaString => {
  const fecha = new Date(fechaString);
  const ahora = new Date();
  const diferencia = ahora - fecha;

  // Define las unidades de tiempo en milisegundos
  const minuto = 60 * 1000;
  const hora = 60 * minuto;
  const dia = 24 * hora;
  const mes = 30 * dia;
  const anio = 365 * dia;

  // Calcula la unidad y el valor apropiados
  if (diferencia < minuto) {
    return "Justo ahora";
  } else if (diferencia < hora) {
    const minutos = Math.floor(diferencia / minuto);
    return `Hace ${minutos} ${minutos == 1 ? "minuto" : "min"}.`;
  } else if (diferencia < dia) {
    const horas = Math.floor(diferencia / hora);
    return `Hace ${horas} ${horas == 1 ? "hora" : "horas"}.`;
  } else if (diferencia < mes) {
    const dias = Math.floor(diferencia / dia);
    return `Hace ${dias} ${dias == 1 ? "día" : "días"}.`;
  } else if (diferencia < anio) {
    const meses = Math.floor(diferencia / mes);
    return `Hace ${meses} ${meses == 1 ? "mes" : "meses"}.`;
  } else {
    const anios = Math.floor(diferencia / anio);
    return `Hace ${anios} ${anios == 1 ? "año" : "años"}.`;
  }
}

export default { timeAgo };