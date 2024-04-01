document.addEventListener('DOMContentLoaded', () => {
  const addCommentForms = document.querySelectorAll('.add-comment-form');

  // Fetch comments for each post when the page loads
  addCommentForms.forEach(form => {
    const postId = form.dataset.postId;
    fetchComments(postId);
  });

  // Create comment
  addCommentForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const postId = form.dataset.postId;
      const content = form.querySelector('textarea').value;
      console.log('Post ID:', postId);
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id: postId,
            content,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          form.querySelector('textarea').value = '';
          console.log('Comment added successfully');
          fetchComments(postId);
        } else {
          const errorData = await response.json();
          console.error('Failed to add comment:', errorData.message);
          alert(`Failed to add comment: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error adding comment.');
      }
    });
  });

  // Edit & Delete click event delegation
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-comment-btn')) {
      const commentId = event.target.dataset.commentId;
      const editForm = document.querySelector(`.edit-comment-form[data-comment-id="${commentId}"]`);
      editForm.style.display = 'block';
    } else if (event.target.classList.contains('delete-comment-btn')) {
      const commentId = event.target.dataset.commentId;
      const postId = event.target.dataset.postId;
      await deleteComment(commentId, postId);
    } else if (event.target.classList.contains('save-edit-comment-btn')) {
      event.preventDefault();
      const editCommentForm = event.target.closest('.edit-comment-form');
      if (editCommentForm) {
        const commentId = editCommentForm.dataset.commentId;
        const postId = editCommentForm.closest('.comment-item').querySelector('.edit-comment-btn').dataset.postId;
        const content = editCommentForm.querySelector('textarea').value;
        await editComment(commentId, postId, content);
      }
    } else if (event.target.classList.contains('cancel-edit-comment-btn')) {
      const editForm = event.target.closest('.edit-comment-form');
      if (editForm) {
        editForm.style.display = 'none';
      }
    }
  });

  // Fetch comments for a specific post
  async function fetchComments(postId) {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const comments = await response.json();
        updateCommentUI(postId, comments);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  // Delete comment
  async function deleteComment(commentId, postId) {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Comment deleted successfully');
        fetchComments(postId);
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  // Edit comment
  async function editComment(commentId, postId, content) {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Comment updated successfully');
        fetchComments(postId);
      } else {
        console.error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  }

// Update the comment UI with the fetched comments
function updateCommentUI(postId, comments) {
  const commentList = document.querySelector(`.comment-list[data-post-id="${postId}"]`);
  commentList.innerHTML = '';

  comments.forEach(comment => {
    const relativeTime = moment(comment.createdAt).fromNow();
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');
    commentItem.innerHTML = `
      <div class="comment-header">
      <p class="comment-content"> <span class="username-color">@${comment.user.username}:</span> ${comment.content} <small class="comment-time"> • ${relativeTime} </small></p>

        <div class="dropdown">
          <i class="fas fa-ellipsis-v"></i>
          <div class="dropdown-content">
            <button class="edit-comment-btn" data-comment-id="${comment.id}" data-post-id="${postId}">Edit</button>
            <button class="delete-comment-btn" data-comment-id="${comment.id}" data-post-id="${postId}">Delete</button>
          </div>
        </div>
      </div>
      <form class="edit-comment-form" style="display: none;" data-comment-id="${comment.id}">
        <div>
          <label for="edit-comment-text-${comment.id}">Edit Comment:</label>
          <textarea id="edit-comment-text-${comment.id}" name="edit-comment-text" required>${comment.content}</textarea>
        </div>
        <button type="submit" class="save-edit-comment-btn">Save</button>
        <button type="button" class="cancel-edit-comment-btn">Cancel</button>
      </form>
    `;

    commentList.appendChild(commentItem);
  });
}
});