
        const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    // Mostrarlo en el elemento con id="username"
    if (username) {
      document.getElementById('username').textContent = username;
    } else {
      document.getElementById('username').textContent = 'Invitado';
    }

    window.addEventListener("DOMContentLoaded", async () => {
      const img = document.getElementById("profile-img");

      try {
        const res = await fetch(`/api/user/profile-image/${userId}`);
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          img.src = url;
        } else {
          img.src = "default.jpg"; // Imagen por defecto si no hay
        }
      } catch (err) {
        console.error("Error al cargar imagen:", err);
      }
    });

            document.getElementById("btn-image").addEventListener("click", () => {
      document.getElementById("file-input").click();
    });




    document.getElementById("file-input").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`/api/user/profile-image/${userId}`, {
          method: "POST", // o PUT si actualizas
          body: formData
        });

        if (res.ok) {
          // Recargar la imagen después de subir
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          document.getElementById("profile-img").src = url;
        } else {
          alert("Error al subir la imagen");
        }
      } catch (err) {
        console.error("Error al subir imagen:", err);
      }
    });

const modal = document.getElementById("modal");
    const openBtn = document.getElementById("openModal");
    const cancelBtn = document.getElementById("cancelModal");
    const form = document.getElementById("postForm");

    openBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });

    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
      form.reset();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      formData.append("user_id", userId);

      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Post added successfully!");
          form.reset();
          modal.style.display = "none";
        } else {
          const errorMsg = await response.text();
          alert("Error: " + errorMsg);
        }
      } catch (error) {
        console.error("Error submitting post:", error);
        alert("An error occurred while submitting your post.");
      }
    });


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
      <button class="Post_delete" id="Post_delete" style="margin-top: 10px; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
      Borrar publicación
      </button>
    `;

    const deleteButton = postElement.querySelector('.Post_delete');
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        try {
          const deleteResponse = await fetch(`/api/posts/${post.id}`, {
            method: 'DELETE'
          });
          if (deleteResponse.ok) {
            postElement.remove(); // Elimina el elemento del DOM
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

    container.appendChild(postElement);
  });
}


document.getElementById('btnGoBack').addEventListener('click', () => {
  window.location.href = '/post.html'; 
})

fetchUserPosts();
