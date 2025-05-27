document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btngopage");
  boton.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
});

document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const search = document.getElementById("search").value;

  const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`);
  const users = await res.json();

  const resultsDiv = document.getElementById("results");

  // Creamos el HTML con botones sin onclick
resultsDiv.innerHTML = users.map((u, index) => `
  <p>
    <button class="btn-info"
            data-user="${u.username}"
            data-email="${u.email}"
            data-id="${u.id}" 
            id="btn-${index}">
      ${u.username}
    </button>
  </p>
`).join('');

  // Ahora asignamos los event listeners a cada botón
  const buttons = resultsDiv.querySelectorAll(".btn-info");
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const username = button.dataset.user;
    const id = button.dataset.id;

    localStorage.setItem('username_friend', username);
    localStorage.setItem('id_friend', id);

    console.log('Usuario guardado en localStorage:', username, id);

    window.location.href = "friend.html";
  });
});
});



const userId = localStorage.getItem('userId'); // El ID del usuario actual, ajusta según tu lógica
document.getElementById('btnfriend').addEventListener('click', async () => {
  const modal = document.getElementById('friendModal');
  modal.innerHTML = '<p>Cargando amigos...</p>';
  modal.style.display = 'block';

  try {
    const response = await fetch(`/api/users/${userId}/friends`);
    const friends = await response.json();

    if (friends.length === 0) {
      modal.innerHTML = `
        <h4>Amigos</h4>
        <p>No tienes ningún amigo agregado.</p>
        <button id="closeModal">Cerrar</button>
      `;
    } else {
      modal.innerHTML = `
        <h4>Amigos</h4>
        <ul>
          ${friends.map(f => `<li>${f.username}</li>`).join('')}
        </ul>
        <button id="closeModal">Cerrar</button>
      `;
    }

    document.getElementById('closeModal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

  } catch (err) {
    modal.innerHTML = `
      <p>Error al cargar amigos.</p>
      <button id="closeModal">Cerrar</button>
    `;
    document.getElementById('closeModal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
});



async function fetchFriendsAndMyPosts(userId) {
  const response = await fetch(`/api/posts/friends/${userId}`);
  const posts = await response.json();

  const container = document.getElementById('friends-posts-container');
  container.innerHTML = ''; // limpiar

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.style.border = '1px solid #ccc';
    postElement.style.padding = '10px';
    postElement.style.borderRadius = '8px';
    postElement.style.background = '#646464';
    postElement.style.marginBottom = '10px';

    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" style="max-width: 100%; height: auto;" />` : ''}
      <small>${new Date(post.created_at).toLocaleString()}</small>
    `;

    container.appendChild(postElement);
  });
}

fetchFriendsAndMyPosts(userId);