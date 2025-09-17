import { Request, Response, NextFunction } from "express";

export const simpleLogger = (req: Request, _res: Response, next: NextFunction) => {
    const now = new Date()
    const dateString = now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR")
    console.log(`METHOD: ${req.method} | ROUTE: ${req.url} | ${dateString}`)
    next()
}