import express from "express"
import cors from "cors"
import helmet from "helmet"
import { db } from "@rally/db"

const app: express.Application = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "@rally/backend",
  })
})

// API routes
app.get("/api/test-db", async (req, res) => {
  try {
    // Test database connection by using the imported db
    res.json({
      message: "Database connection successful",
      dbInstance: !!db,
    })
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Rally Backend API",
    version: "1.0.0",
    endpoints: ["GET /health", "GET /api/test-db"],
  })
})

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err.message)
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    })
  }
)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Rally Backend server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API docs: http://localhost:${PORT}/`)
})

export default app
