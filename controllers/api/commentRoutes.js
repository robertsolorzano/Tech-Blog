const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Create new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get all comments with associated posts
router.get('/', async (req, res) => {
  try {
    const { postId } = req.query;
    const commentData = await Comment.findAll({
      where: postId ? { post_id: postId } : {},
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'content', 'created_at'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    res.status(200).json(commentData);
  } catch (err) {
    console.error('Error retrieving comments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletedComment = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!deletedComment) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;