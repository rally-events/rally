import express from "express"
import cors from "cors"
import helmet from "helmet"
import userRouter from "./routes/user-router"
import compression from "@polka/compression"

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
)
app.use(compression())
app.use("/api/users", userRouter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
