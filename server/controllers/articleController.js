import crypto from 'crypto';

import {
    createArticle,
    deleteArticle,
    updateArticle
} from '../models/articleModel.js';

import { slugify } from '../utils/slugify.js';

export const saveArticle = async (req, res) => {
    const {
        title,
        subtitle,
        description,
        heroImg,
        body
    } = req.body;

    const slug =
        `${slugify(title)}-${slugify(subtitle)}-${crypto.randomUUID().slice(0, 6)}`;

    try {
        const record = await createArticle({
            Title: title,
            'Sub-Title': subtitle,
            Description: description,
            'Hero-Img': heroImg,
            Body: body,
            Slug: slug
        });

        res.status(201).json({
            message: 'Article saved',
            recordId: record.id,
            slug
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to save article'
        });
    }
};

export const getArticles = async (req, res) => {
    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/ArticlePost?sort[0][field]=CreatedAt&sort[0][direction]=desc`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
                }
            }
        );

        const data = await response.json();

        if (data.records) {
            res.json(data.records);
        } else {
            res.status(404).json({
                error: 'No articles found'
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getArticleBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const formula = encodeURIComponent(
            `{Slug} = '${slug}'`
        );

        const response = await fetch(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/ArticlePost?filterByFormula=${formula}&maxRecords=1`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
                }
            }
        );

        const data = await response.json();

        if (data.records?.length > 0) {
            res.json(data.records[0]);
        } else {
            res.status(404).json({
                error: 'Article not found'
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const removeArticle = async (req, res) => {
    try {
        await deleteArticle(req.params.id);

        res.status(200).json({
            message: 'Article successfully deleted from Airtable'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const editArticle = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        subtitle,
        description,
        heroImg,
        body
    } = req.body;

    try {
        const record = await updateArticle(id, {
            Title: title,
            'Sub-Title': subtitle,
            Description: description,
            'Hero-Img': heroImg,
            Body: body
        });

        res.status(200).json({
            message: 'Article updated successfully',
            recordId: record.id
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
};