
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pageRoutes from './routes/pageRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import { registerMiddleware } from './middleware/commonMiddleware.js';

import './config/airtable.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

registerMiddleware(app);

app.use(
    express.static(
        path.join(__dirname, '..', 'client')
    )
);

app.use(pageRoutes(__dirname));
app.use(articleRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});





// import express from 'express';
// import fs from 'fs/promises';
// import path from 'path';
// import cors from 'cors';
// import Airtable from 'airtable';
// import dotenv from 'dotenv';
// import crypto from 'crypto'; // CORRECTION: Explicitly import crypto to prevent runtime ReferenceErrors across different Node environments
// import { fileURLToPath } from 'url';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// const base = new Airtable({
//     apiKey: process.env.AIRTABLE_TOKEN
// }).base(process.env.AIRTABLE_BASE_ID);

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, '..', 'client')));

// app.get(['/dashboard', '/dashboard.html'], (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'dashboard', 'dashboard.html'));
// });

// // app.get(['/posts', '/posts.html'], (req, res) => {
// //     res.sendFile(path.join(__dirname, '..', 'client', 'posts', 'posts.html'));
// // });

// /* -------------------- FRONTEND CLEAN SLUG ROUTING -------------------- */
// // This serves your posts.html page whenever someone visits '/posts/any-slug-text'
// app.get('/posts/:slug', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'posts', 'posts.html'));
// });

// app.get(['/', '/index.html'], (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'homepage', 'index.html'));
// });

// app.get(['/about', '/about.html'], (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'homepage', 'about.html'));
// });


// /* -------------------- 1. AIRTABLE POST (SAVE ARTICLE) -------------------- */

// app.post('/articles', async (req, res) => {
//     console.log(req.body);

//     const {
//         title,
//         subtitle,
//         description,
//         heroImg,
//         body
//     } = req.body;

//     const slugify = (text) =>
//         text
//             .toString()
//             .toLowerCase()
//             .trim()
//             .replace(/&/g, '-and-')
//             .replace(/[\s\W-]+/g, '-');

//     const now = new Date().toISOString();
//     const slug = `${slugify(title)}-${slugify(subtitle)}-${crypto.randomUUID().slice(0, 6)}`;

//     try {
//         const records = await base('ArticlePost').create([
//             {
//                 fields: {
//                     Title: title,
//                     'Sub-Title': subtitle,
//                     Description: description,
//                     'Hero-Img': heroImg,
//                     Body: body,
//                     Slug: slug,
//                 }
//             }
//         ]);

//         res.status(201).json({
//             message: 'Article saved',
//             recordId: records[0].id,
//             slug
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Failed to save article'
//         });
//     }
// });




// /* -------------------- GET ALL ARTICLES (LATEST FIRST) -------------------- */
// app.get("/api/articles", async (req, res) => {
//     try {
//         const response = await fetch(
//             `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/ArticlePost?sort[0][field]=CreatedAt&sort[0][direction]=desc`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
//                 },
//             }
//         );

//         const data = await response.json();
//         if (data.records) {
//             res.json(data.records);
//         } else {
//             res.status(404).json({ error: "No articles found" });
//         }
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


// /* -------------------- GET ARTICLE BY SLUG -------------------- */
// app.get("/api/articles/slug/:slug", async (req, res) => {
//     const { slug } = req.params;
//     try {
//         // Use formula to find matching slug field in Airtable
//         const formula = encodeURIComponent(`{Slug} = '${slug}'`);
//         const response = await fetch(
//             `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/ArticlePost?filterByFormula=${formula}&maxRecords=1`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
//                 },
//             }
//         );

//         const data = await response.json();
//         if (data.records && data.records.length > 0) {
//             res.json(data.records[0]);
//         } else {
//             res.status(404).json({ error: "Article not found" });
//         }
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


// /* -------------------- DELETE AN ARTICLE BY RECORD ID -------------------- */
// app.delete('/api/articles/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await base('ArticlePost').destroy(id);
//         res.status(200).json({ message: 'Article successfully deleted from Airtable' });
//     } catch (error) {
//         console.error("Failed to delete record:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// /* -------------------- UPDATE AN EXISTING ARTICLE -------------------- */
// app.put('/api/articles/:id', async (req, res) => {
//     const { id } = req.params;
//     const { title, subtitle, description, heroImg, body } = req.body;

//     try {
//         const records = await base('ArticlePost').update([
//             {
//                 id: id,
//                 fields: {
//                     Title: title,
//                     'Sub-Title': subtitle,
//                     Description: description,
//                     'Hero-Img': heroImg,
//                     Body: body
//                 }
//             }
//         ]);

//         res.status(200).json({ message: 'Article updated successfully', recordId: records[0].id });
//     } catch (error) {
//         console.error("Failed to update record:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// /* -------------------- START SERVER -------------------- */

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });