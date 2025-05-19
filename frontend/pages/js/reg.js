const form = document.getElementById('registroForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log(result);


    

    if (response.status === 201) {
       
      window.location.href = '/'; // <-- Cambia a la página a donde quieres redirigir
    } else {
      alert('Error: ' + result.error);
    }

    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  });
} else {
  console.error('❌ No se encontró el formulario con id "registroForm"');
}


document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("fall");
  boton.addEventListener("click", () => {
    window.location.href = "/";
  });
});