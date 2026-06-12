import express from 'express';
import cors from 'cors';

export const registerMiddleware = (app) => {
    app.use(cors());
    app.use(express.json());
};