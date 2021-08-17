// Post Controls
// ------------------------- IMPORTS -------------------------

// ---- import Models
const Post = require('../models/Post');
const Comment = require('../models/Comment');


// ============================================================
// -------------------------- CONTROLS ------------------------

// ------------ POST
exports.createPost = (req, res, next) => {
    const newPost = new Post({
        ...req.body.post,
       // imgUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: req.body.userId
    });
    // insert post in Db
    Post.create(newPost)
        .then(message => res.status(201).json({ message }))
        .catch(error => res.status(500).json({ error }));
};


exports.editPost = (req, res, next) => {
    // Find the post to check if the user is the author of the Post
    Post.findOne(req.params.id)
        .then(dbPost => {
            const isAuthor = dbPost.id_user === req.body.userId ? true : false;

            // the user is not the author
            if (!isAuthor) { throw 'You are not the author of the Post' };

            // the user is the author
            const editedPost = {
                userId: req.body.userId,
                ...req.body.post,
                postId: req.params.id
            };
            // modify in db
            Post.edit(editedPost)
                .then(message => res.status(201).json({ message }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.deletePost = (req, res, next) => {
    // Find the post to check if the user is the author of the Post
    Post.findOne(req.params.id)
        .then(dbPost => {
            const isAuthor = dbPost.id_user === req.body.userId ? true : false;

            // the user is not the author
            if (!isAuthor) { throw 'You are not the author of the Post' };

            // the user is the author
            const ids = { postId: req.params.id, userId: req.body.userId }
            Post.delete(ids)
                .then(message => res.status(201).json({ message }))
                .catch(error => res.status(500).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));
};


exports.getAllPosts = (req, res, next) => {
    Post.findAll()
        .then(posts => res.status(201).json(posts))
        .catch(error => res.status(500).json({ error }));
};


exports.getOnePost = (req, res, next) => {
    // get the post from id post
    Post.findOne(req.params.id)
        .then(post => {
            // get all comments of the Post
            Comment.findAll(req.params.id)
                .then(comments => {
                    const postWithComments = { ...post, comments: comments };
                    res.status(201).json(postWithComments)
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};