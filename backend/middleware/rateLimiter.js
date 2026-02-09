import ratelimit from "../config/upstash.js";

const rateLimiter = async (req , res , next ) => {
    try {
        // Use IP address as unique identifier for each user
        const ip = req.ip || req.headers["x-forwarded-for"] || "anonymous";
        const { success } = await ratelimit.limit(ip);

        if(!success) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }

        next();


    } catch (error) {
        console.log("rate limit error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default rateLimiter;