import ratelimit from "../config/upstash.js";

const rateLimiter = async(req,res, next) => {
    try {
        // here we just keep it simple 
        // in real-world-app you have like to put the userId or ipAddress as your key
        const {success} = await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message : "Too many requests, please try again later after sometime"
            })
        }

        next();
    } catch (error) {
        console.log("Rate limit error ", error);
        next(error);
    }
}

export default rateLimiter;