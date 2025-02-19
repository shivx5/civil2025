const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.options(
  "*",
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.static(path.join(__dirname)));
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "register_form.html"));
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Enhanced logging
const logger = {
  info: (message) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
  error: (message) =>
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
};

// Track pending email operations
let pendingEmails = new Set();

// Enhanced graceful shutdown handler
const gracefulShutdown = async () => {
  logger.info("Initiating graceful shutdown...");

  if (pendingEmails.size > 0) {
    logger.info(
      `Waiting for ${pendingEmails.size} pending email(s) to complete...`
    );
    try {
      await Promise.race([
        Promise.all([...pendingEmails]),
        new Promise((resolve) => setTimeout(resolve, 10000)), // 10 second timeout
      ]);
      logger.info("All pending emails completed successfully");
    } catch (error) {
      logger.error(`Error completing pending emails: ${error.message}`);
      // Save unsent emails to disk
      const unsentEmails = [...pendingEmails].map((p) => p.mailOptions);
      fs.writeFileSync(
        path.join(__dirname, "unsent_emails.json"),
        JSON.stringify(unsentEmails)
      );
    }
  }

  logger.info("Server shutdown complete");
  process.exit(0);
};

// Process termination handlers
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGUSR2", gracefulShutdown);
process.on("exit", gracefulShutdown);
process.on("beforeExit", gracefulShutdown);

// Keep process alive
process.stdin.resume();
process.on("disconnect", () => {
  logger.info("Parent process disconnected, keeping server running");
  setTimeout(() => gracefulShutdown(), 10000);
});

// Process unsent emails on startup
const processUnsentEmails = () => {
  const unsentPath = path.join(__dirname, "unsent_emails.json");
  if (fs.existsSync(unsentPath)) {
    try {
      const unsentEmails = JSON.parse(fs.readFileSync(unsentPath));
      unsentEmails.forEach((mailOptions) => {
        const emailPromise = new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              logger.error(`Failed to send unsent email: ${error.message}`);
              reject(error);
            } else {
              logger.info(`Successfully sent unsent email: ${info.response}`);
              resolve(info);
            }
          });
        });
        pendingEmails.add(emailPromise);
      });
      fs.unlinkSync(unsentPath);
      logger.info(`Processed ${unsentEmails.length} unsent emails`);
    } catch (error) {
      logger.error(`Error processing unsent emails: ${error.message}`);
    }
  }
};

// Process any unsent emails on server start
processUnsentEmails();

// Form submission endpoint
app.post("/submit-form", upload.single("paymentSlip"), (req, res) => {
  const formData = req.body;
  const paymentSlipPath = req.file ? req.file.path : null;

  const technicalEvents = Array.isArray(formData.technicalEvents)
    ? formData.technicalEvents
    : [formData.technicalEvents].filter(Boolean);
  const nonTechnicalEvents = Array.isArray(formData.nonTechnicalEvents)
    ? formData.nonTechnicalEvents
    : [formData.nonTechnicalEvents].filter(Boolean);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "construosrmvec2025@gmail.com",
    subject: "New Event Registration",
    text: `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      College: ${formData.college}
      Year: ${formData.year}
      Technical Events: ${technicalEvents.join(", ")}
      Non-Technical Events: ${nonTechnicalEvents.join(", ")}
      Payment Slip: ${paymentSlipPath ? "Attached" : "Not provided"}
    `,
  };

  if (paymentSlipPath) {
    mailOptions.attachments = [
      {
        filename: req.file.originalname,
        path: paymentSlipPath,
      },
    ];
  }

  const emailPromise = new Promise((resolve, reject) => {
    logger.info(`Starting email send to ${mailOptions.to}`);

    transporter.sendMail(mailOptions, (error, info) => {
      pendingEmails.delete(emailPromise);

      if (error) {
        logger.error(`Email send failed: ${error.message}`);
        logger.error(`Mail Options: ${JSON.stringify(mailOptions)}`);
        logger.error(`Form Data: ${JSON.stringify(formData)}`);
        reject(error);
        return res.status(500).json({
          error: "Failed to send email",
          details: error.message,
          mailOptions: mailOptions,
        });
      }

      logger.info(`Email successfully sent: ${info.response}`);
      resolve(info);
      res.json({
        message: "Registration successful! We will contact you soon.",
      });
    });
  });

  pendingEmails.add(emailPromise);
});

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Using email account: ${process.env.EMAIL_USER}`);
  logger.info("Email authentication configured");
});

// Error handlers
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown();
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    Promise.all([...pendingEmails])
      .then(() => {
        console.log("Server closed, all emails sent");
        process.exit(0);
      })
      .catch((err) => {
        console.error("Error completing pending emails:", err);
        process.exit(1);
      });
  });
});
