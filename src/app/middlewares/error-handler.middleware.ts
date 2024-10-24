import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    // Log l'erreur pour le débogage
    console.error('An error occurred:', error);

    const formattedError = {
        message: error.message || 'An unexpected error occurred',
        code: error.statusCode || error.status || 500 // Vérifie le statut
    };

    // Envoie la réponse JSON
    res.status(formattedError.code).json(formattedError); // Utilise res.status() pour définir le code
};
