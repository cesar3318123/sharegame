  document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username_friend');
    const id = localStorage.getItem('id_friend');

    const friendInfo = document.getElementById('friendInfo');

    if (username && id) {
      friendInfo.textContent = `Amigo: ${username} `;
    } else {
      friendInfo.textContent = 'No se encontró información del amigo.';
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username_friend');
  const id = localStorage.getItem('id_friend');

  const friendInfo = document.getElementById('friendInfo');

  if (username && id) {
    friendInfo.textContent = `Amigo: ${username}`;
  } else {
    friendInfo.textContent = 'No se encontró información del amigo.';
  }

  if (!id) return;

  const img = document.createElement("img");
  img.src = `/users/${id}/profile-image1`;
  img.alt = "Imagen del amigo";
  img.style.maxWidth = "200px"; // opcional, para que no se vea gigante
  img.style.borderRadius = "8px"; // opcional, para que se vea bien

  const imageContainer = document.getElementById('friendImageContainer');
  if (imageContainer) {
    imageContainer.innerHTML = ''; // limpiar por si hay algo viejo
    imageContainer.appendChild(img);
  }
});
