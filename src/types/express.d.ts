import express from "express";

declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
            },
            cookie: {
                refreshToken: string
            },
            auth: {
                userId: string
            },
            params?: {
                id?: string;
            };
        }
    }
}

