// public/pages/js/login.js
const form = document.getElementById('loginForm');


if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log(result);
      console.log('Access token recibido:', result.accessToken);

      if (response.status === 200) {
        localStorage.setItem('username', result.user.username);
        localStorage.setItem('userId', result.user.id);

        console.log('Usuario guardado en localStorage:', result.user.username, result.user.id);
        // ✅ Inicio de sesión exitoso
        window.location.href = '/post.html'; // Cambia esto a la página a la que quieras redirigir después del login
      } else {
        // ❌ Error en login
        alert('Error: ' + result.error);
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  });
} else {
  console.error('❌ No se encontró el formulario con id "loginForm"');
}


document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btnregister");
  boton.addEventListener("click", () => {
    window.location.href = "reg.html";
  });
});