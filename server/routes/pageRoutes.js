import express from 'express';
import {
    homePage,
    aboutPage,
    dashboardPage,
    postsPage
} from '../controllers/pageController.js';

const router = express.Router();

export default (__dirname) => {
    router.get(
        ['/', '/index.html'],
        (req, res) => homePage(__dirname, req, res)
    );

    router.get(
        ['/about', '/about.html'],
        (req, res) => aboutPage(__dirname, req, res)
    );

    router.get(
        ['/dashboard', '/dashboard.html'],
        (req, res) => dashboardPage(__dirname, req, res)
    );

    router.get(
        '/posts/:slug',
        (req, res) => postsPage(__dirname, req, res)
    );

    return router;
};