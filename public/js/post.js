const createPostForm = document.querySelector('#new-post-form');
const editPostForms = document.querySelectorAll('.edit-post-form');
const postContainer = document.querySelector('#post-container');

// Create post 
createPostForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.querySelector('#post-title').value.trim();
  const content = document.querySelector('#post-content').value.trim();

  console.log('Form data:', { title, content });

  if (title && content) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create post');
    }
  }
});

// Edit/Delete 
postContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('edit-post-btn')) {
    const postId = event.target.dataset.postId;
    const editForm = document.querySelector(`.edit-post-form[data-post-id="${postId}"]`);
    editForm.style.display = 'block';

    const response = await fetch(`/api/posts/${postId}`);
    const post = await response.json();

    const titleInput = editForm.querySelector('#edit-post-title');
    const contentInput = editForm.querySelector('#edit-post-content');
    titleInput.value = post.title;
    contentInput.value = post.content;
  } else if (event.target.classList.contains('delete-post-btn')) {
    const postId = event.target.dataset.postId;

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const postEl = document.querySelector(`.post[data-post-id="${postId}"]`);
      postEl.remove();
    } else {
      alert('Failed to delete post');
    }
  }
});

// Save edit 
editPostForms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const postId = event.target.getAttribute('data-post-id');
    const title = event.target.querySelector('#edit-post-title').value.trim();
    const content = event.target.querySelector('#edit-post-content').value.trim();

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const postEl = event.target.closest('.post');
      postEl.querySelector('h3').textContent = title;
      postEl.querySelector('p:nth-child(2)').textContent = content;
      form.style.display = 'none';
    } else {
      alert('Failed to update post');
    }
  });
});

// Cancel edit
const cancelEditBtns = document.querySelectorAll('.cancel-edit-btn');
cancelEditBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const editForm = event.target.closest('.edit-post-form');
    editForm.style.display = 'none';
  });
});