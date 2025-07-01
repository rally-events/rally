import { Router } from "express"

const router = Router()

router.post("/", (_, res) => {
  res.status(200).json({
    message: "Hello World",
  })
})

export default router
