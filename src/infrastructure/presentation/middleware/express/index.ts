import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import {
  Application,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
// import expressSession from "express-session";

export const corsConfig = () => {
  return cors({
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH"], // HTTP methods allowed from cross-origin requests
    origin: process.env.CORS_ORIGIN || "http://localhost:4000", // which domains can access your AP
    credentials: true, // Controls cookie and authentication handling
    exposedHeaders: ["Content-Length", "X-Kuma-Revision"], //  Specifies which response headers clients can access
    allowedHeaders: ["Content-Type", "Authorization"], // Defines which request headers are permitted
    maxAge: 3600, // 1 hour  // Sets how long browsers cache CORS configuration // Reduces preflight requests for repeated requests
  });
};

export const helmetConfig = () => {
  return helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Controls how resources are shared across origins // cross-origin allows sharing with all origins // Prevents sensitive data exposure
    contentSecurityPolicy: {
      //  Defines which sources of content are allowed
      directives: {
        defaultSrc: ["'self'"], // Sets default allowed sources for all resources
        scriptSrc: ["'self'", "'unsafe-inline'"], // Controls which scripts can run
        styleSrc: ["'self'", "'unsafe-inline'"], //  Defines allowed stylesheet sources
        fontSrc: ["'self'", "data:"], // Specifies allowed font sources
        imgSrc: ["'self'", "data:"], // Controls image sources
        objectSrc: ["'none'"], //  Manages plugin sources
        upgradeInsecureRequests: [], // Forces HTTPS for HTTP resources
      },
    },
    noSniff: true, //Prevents MIME-type sniffing
  });
};

export const rateLimitConfig = () => {
  return rateLimit({
    message: "Too many request. Please wait before trying",
    limit: 5000,
    windowMs: 15 * 60 * 1000, // 15 minutes // Defines the period during which requests are counted // Helps prevent brute-force attacks
    max: 50, // Maximum requests allowed in the window // Prevents API abuse
    standardHeaders: true, // Enables modern rate limit headers
    legacyHeaders: false, // Disables older header format
    handler: (_req: Request, res: Response, _next: NextFunction) => {
      // Custom error response handler
      res.status(429).json({
        error: "Too many requests",
        message: "Please wait before trying again",
        retryAfter: res.getHeader("Retry-After") || 60,
        //   retryAfter: Math.ceil(res.get("Retry-After") / 1000),
      });
    },
  });
};

export const jsonConfig = () => {
  return json({
    limit: "50kb", // Maximum request body size //Prevents large payload attacks
    strict: true, // Enforces strict JSON parsing // Prevents parsing of HTML-prefixed JSON Improves security against JSON hijacking
  });
};

export const urlencodedConfig = () => {
  return urlencoded({
    limit: "50kb", // Maximum request body size //Prevents large payload attacks
    extended: true, //  Enables extended parsing of URL-encoded bodies // Allows nested objects in URL-encoded data
    parameterLimit: 1000, // Maximum number of URL-encoded parameters
  });
};

export const cookieParserConfig = () => {
  const secret =
    process.env.NODE_ENV === "production"
      ? process.env.COOKIE_SECRET
      : "dev-secret";
  return cookieParser(secret);
};

// export const expressCookieConfig = () => {
//   return expressSession({
//     secret: process.env.SESSION_SECRET || "session-secret",
//     resave: false,
//     saveUninitialized: false,
//     name: "session",

//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       maxAge: 60 * 60 * 1000, // 1 hour
//     },
//   });
// };

export const compressionConfig = () => {
  return compression({});
};

export const serverMiddlewareConfig = (app: Application) => {
  app.use(compressionConfig());
  app.use(jsonConfig());
  app.use(rateLimitConfig());
  app.use(helmetConfig());
  app.use(corsConfig());
  app.use(urlencodedConfig());
  app.use(cookieParserConfig());
  //   app.use(expressCookieConfig());
};
