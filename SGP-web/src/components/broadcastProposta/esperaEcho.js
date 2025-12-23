// utils/esperaEcho.js
export function esperaEcho (callback) {
  if (window.Echo) {
    callback()
  } else {
    const intervalo = setInterval(() => {
      if (window.Echo) {
        clearInterval(intervalo)
        callback()
      }
    }, 100)
  }
}
