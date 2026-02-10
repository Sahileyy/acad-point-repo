import express from "express";

const router = express.Router();

/* REGISTER STUDENT */
router.post("/register", (req, res) => {
  console.log("Student register route HIT");
  console.log(req.body);

  res.status(200).json({
    success: true,
    message: "Student registered successfully"
  });
});

export default router;
