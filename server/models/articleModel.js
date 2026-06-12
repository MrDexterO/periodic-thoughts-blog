import base from '../config/airtable.js';

export const createArticle = async (fields) => {
    const records = await base('ArticlePost').create([
        { fields }
    ]);

    return records[0];
};

export const deleteArticle = async (id) => {
    return await base('ArticlePost').destroy(id);
};

export const updateArticle = async (id, fields) => {
    const records = await base('ArticlePost').update([
        {
            id,
            fields
        }
    ]);

    return records[0];
};