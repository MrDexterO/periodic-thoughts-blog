import express from 'express';

import {
    saveArticle,
    getArticles,
    getArticleBySlug,
    removeArticle,
    editArticle
} from '../controllers/articleController.js';

const router = express.Router();

router.post('/articles', saveArticle);

router.get('/api/articles', getArticles);

router.get(
    '/api/articles/slug/:slug',
    getArticleBySlug
);

router.delete(
    '/api/articles/:id',
    removeArticle
);

router.put(
    '/api/articles/:id',
    editArticle
);

export default router;