document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btngopage");
  boton.addEventListener("click", () => {

    var username_condition_guest = localStorage.getItem('username');
    
    if (username_condition_guest === 'guest') {
      alert("No puedes acceder a esta página como invitado.");
    } else {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert("Debes iniciar sesión para acceder a esta página.");
      } else {
       window.location.href = "profile.html";
      }
      
    }
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
        ${friends.map(f => `
          <li>
            ${f.username}
            <p>🎮🕹️👾🖥️🎲 </p> 
            <button class="view-profile-btn" data-id="${f.id}">Ver perfil</button>
            <button class="delete-friend-btn" data-id="${f.id}">Eliminar</button>
          </li>
        `).join('')}
      </ul>
      <button id="closeModal">Cerrar</button>
    `;





    
    }

    document.getElementById('closeModal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

Array.from(document.getElementsByClassName('view-profile-btn')).forEach(button => {
  button.addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.id;
    
    // Buscar el objeto f correspondiente usando su id
    const friend = friends.find(f => f.id.toString() === id);

    if (friend) {
      localStorage.setItem('id_friend', friend.id); // o puedes guardar más datos aquí
      localStorage.setItem('username_friend', friend.username);
      window.location.href = 'friend.html';
    } else {
      console.error('Amigo no encontrado con id:', id);
    }
  });
});

Array.from(document.getElementsByClassName('delete-friend-btn')).forEach(button => {
  button.addEventListener('click', async (e) => {
    const id = e.currentTarget.dataset.id; // ID del amigo (desde el botón)
    const id_user = localStorage.getItem('userId'); // ID del usuario logueado

    if (!id_user || !id) {
      console.error('Faltan IDs para eliminar amistad');
      return;
    }

    const friend = friends.find(f => f.id.toString() === id);
    if (!friend) {
      console.error('No se encontró el amigo en la lista');
      return;
    }

    try {
      const response = await fetch('/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(id_user),
          friend_id: friend.id
        })
      });

      if (response.ok) {
        alert('Amistad eliminada correctamente');
        // Opcional: actualizar la interfaz
        window.location.reload(); // Recargar la página para reflejar los cambios
      } else {
        const errorText = await response.text();
        console.error('Error al eliminar amistad:', errorText);
        alert('No se pudo eliminar la amistad.');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error de red o del servidor.');
    }
  });
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

    const container = document.getElementById('friends-posts-container');
  container.innerHTML = ''; // limpiar

  

  if(localStorage.getItem('username') === 'guest') {



    const postElement = document.createElement('div');
    postElement.style.border = '1px solid #ccc';
    postElement.style.padding = '10px';
    postElement.style.borderRadius = '8px';
    postElement.style.background = '#646464';
    postElement.style.marginBottom = '10px';

    postElement.innerHTML = `
      <h1>Bienvenido invitado</h1>
      <h3>Registrate para empezar</h3>
      <p>Explora la app viendo publicaciones y diviertete conectando con tus amigos a traves de sus vivencias.</p>
      <img src="pages/img/final.png" alt="Imagen de ejemplo" style="max-width: 100%; height: auto;" />
  
    `;

    container.appendChild(postElement);



  } else {

  const response = await fetch(`/api/posts/friends/${userId}`);
  const posts = await response.json();
  const userrole = localStorage.getItem('userRole');
  const deleteButtonHTML = userrole === 'admin' || userrole === 'moderator' ? `
    <button class="deleteProfile" style="margin-top: 10px; padding: 5px 10px; border-radius: 5px; background-color: green; cursor: pointer;">
      Borrar publicación
    </button>` : '';







  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.style.border = '1px solid #ccc';
    postElement.style.padding = '10px';
    postElement.style.borderRadius = '8px';
    postElement.style.background = '#646464';
    postElement.style.marginBottom = '10px';

    postElement.innerHTML = `
      <h2>${post.username} subio: </h2>
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" style="max-width: 100%; height: auto;" />` : ''}
      <small>${new Date(post.created_at).toLocaleString()}</small>
      <button id="viewPostBtn" style="margin-top: 10px; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
      Ver Perfil
      </button>
      ${deleteButtonHTML}
 
    `;

    container.appendChild(postElement);

    const viewPostBtn = postElement.querySelector('#viewPostBtn');
    viewPostBtn.addEventListener('click', () => {
    window.location.href = '/friend.html';
})
    const deleteButton = postElement.querySelector('.deleteProfile');
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        try {
          const deleteResponse = await fetch(`/api/posts/${post.id}`, {
            method: 'DELETE'
          });
          if (deleteResponse.ok) {
            postElement.remove();
            alert('Publicación eliminada correctamente.');
          } else {
            alert('Error al eliminar la publicación.');
          }
        } catch (error) {
          console.error('Error al eliminar la publicación:', error);
          alert('Error al eliminar la publicación.');
        }
      });
    }
  
  })};
}


document.getElementById('btnlogout').addEventListener('click', () => {
  window.location.href = '/';
  localStorage.removeItem('accessToken');
})



document.getElementById('btnlog_register').addEventListener('click', () => {
  window.location.href = 'reg.html'; 
})






fetchFriendsAndMyPosts(userId);


