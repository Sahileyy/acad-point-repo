import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "acad-point-secret-2024";

/**
 * Middleware: verify JWT token from Authorization header
 */
export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

/**
 * Middleware: restrict access by role(s)
 * Usage: requireRole("faculty") or requireRole("faculty", "admin")
 */
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
}
