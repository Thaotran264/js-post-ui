import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      close: true,
      style: {
        background: '#81c784',
      },
    }).showToast()
  },

  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      close: true,
      style: {
        background: '#4fc3f7',
      },
    }).showToast()
  },

  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top', // `top` or `bottom`
      close: true,
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#d32f2f',
      },
    }).showToast()
  },
}
