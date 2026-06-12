import path from 'path';

export const homePage = (__dirname, req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'client', 'homepage', 'index.html')
    );
};

export const aboutPage = (__dirname, req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'client', 'homepage', 'about.html')
    );
};

export const dashboardPage = (__dirname, req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'client', 'dashboard', 'dashboard.html')
    );
};

export const postsPage = (__dirname, req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'client', 'posts', 'posts.html')
    );
};