document.addEventListener('DOMContentLoaded', () => {
  const addCommentForms = document.querySelectorAll('.add-comment-form');

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

  // Update the comment UI with the fetched comments
  function updateCommentUI(postId, comments) {
    const commentList = document.querySelector(`.comment-list[data-post-id="${postId}"]`);
    commentList.innerHTML = '';

    comments.forEach(comment => {
      const commentItem = document.createElement('div');
      commentItem.classList.add('comment-item');
      commentItem.innerHTML = `
        <p>${comment.content}</p>
        <p>Posted by: ${comment.user.username}</p>
        <p>Posted on: ${new Date(comment.createdAt).toLocaleString()}</p>
      `;
      commentList.appendChild(commentItem);
    });
  }

  // Fetch comments for each post when the page loads
  addCommentForms.forEach(form => {
    const postId = form.dataset.postId;
    fetchComments(postId);
  });
});