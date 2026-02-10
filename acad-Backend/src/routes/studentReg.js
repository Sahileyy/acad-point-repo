router.post("/students/register", async (req, res) => {
  try {
    const { registerNumber, name, semester, password } = req.body;

    console.log("Incoming data:", req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      registerNumber,
      name,
      semester,
      password: hashedPassword,
    });

    await student.save();

    console.log("STUDENT SAVED:", student);

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
