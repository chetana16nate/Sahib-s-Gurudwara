import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

import authRoutes from "./src/routes/auth.js";
import contentRoutes from "./src/routes/content.js";
import contactRoutes from "./src/routes/contact.js";
import donationRoutes from "./src/routes/donations.js";
import langarRoutes from "./src/routes/langar.js";
import reviewRoutes from "./src/routes/reviews.js";
import availabilityRoutes from "./src/routes/availability.js";
import sevaRoutes from "./src/routes/seva.js";

import {
    errorHandler,
    notFound,
} from "./src/middleware/errors.js";

const app = express();

/* =========================================================
   CORS  –  open to all origins
========================================================= */

app.use(helmet());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

/* =========================================================
   BODY PARSING
========================================================= */

app.use(express.json({ limit: "100kb" }));

/* =========================================================
   LOGGING
========================================================= */

app.use(
    morgan(
        process.env.NODE_ENV === "production"
            ? "combined"
            : "dev"
    )
);

/* =========================================================
   RATE LIMIT
========================================================= */

app.use(
    "/api",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        standardHeaders: "draft-8",
        legacyHeaders: false,
    })
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
    });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/content", contentRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/donations", donationRoutes);

app.use("/api/langar", langarRoutes);

app.use("/api/reviews", reviewRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/seva", sevaRoutes);

/* =========================================================
   ERROR HANDLING
========================================================= */

app.use(notFound);

app.use(errorHandler);

export default app;


