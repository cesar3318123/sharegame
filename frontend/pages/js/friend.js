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

const userId = localStorage.getItem('id_friend');

    async function fetchUserPosts() {
  const response = await fetch(`/api/posts/user/${userId}`);
  const posts = await response.json();

  const container = document.getElementById('posts-container');
  container.innerHTML = ''; // Limpia antes

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.style.border = '1px solid #ccc';
    postElement.style.padding = '10px';
    postElement.style.borderRadius = '8px';
    postElement.style.background = '#646464';


    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" style="max-width: 100%; height: auto;" />` : ''}
      <small>${new Date(post.created_at).toLocaleString()}</small>
    `;

    container.appendChild(postElement);
  });
}

fetchUserPosts();


document.getElementById('addFriendBtn').addEventListener('click', async () => {
  // Obtenemos los IDs del localStorage
  const userId = localStorage.getItem('userId');
  const friendId = localStorage.getItem('id_friend');

  // Validamos que ambos IDs existan
  if (!userId || !friendId) {
    return alert('No se encontraron los IDs necesarios.');
  }

  // Verificamos que no se agregue a sí mismo
  if (userId === friendId) {
    return alert('No puedes agregarte a ti mismo.');
  }

  try {
    // Enviamos la solicitud POST al backend
    const response = await fetch('/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        friend_id: friendId
      })
    });

    if (response.ok) {
      alert('Amigo agregado con éxito!');
    } else {
      const msg = await response.text();
      alert('Error: ' + msg);
    }
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al agregar al amigo.');
  }
});
