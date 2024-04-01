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

// Edit inline/Save/Delete 
postContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('edit-post-btn')) {
    const postId = event.target.dataset.postId;
    const postTitle = document.querySelector(`.post-title[data-post-id="${postId}"]`);
    const postContent = document.querySelector(`.post-content[data-post-id="${postId}"]`);
    
    postTitle.contentEditable = true;
    postContent.contentEditable = true;
    
    postTitle.focus();
  
    event.target.textContent = 'Save';
    event.target.classList.add('save-edit-btn');
    event.target.classList.remove('edit-post-btn');
  } else if (event.target.classList.contains('save-edit-btn')) {
    const postId = event.target.dataset.postId;
    const postTitle = document.querySelector(`.post-title[data-post-id="${postId}"]`);
    const postContent = document.querySelector(`.post-content[data-post-id="${postId}"]`);

    const title = postTitle.textContent.trim();
    const content = postContent.textContent.trim();

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      postTitle.contentEditable = false;
      postContent.contentEditable = false;
      event.target.textContent = 'Edit';
      event.target.classList.remove('save-edit-btn');
      event.target.classList.add('edit-post-btn');
    } else {
      alert('Failed to update post');
    }
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

// Cancel edit
const cancelEditBtns = document.querySelectorAll('.cancel-edit-btn');
cancelEditBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const editForm = event.target.closest('.edit-post-form');
    editForm.style.display = 'none';
  });
});