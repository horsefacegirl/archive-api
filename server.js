import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/file-archive";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const File = mongoose.model("File", {
  description: {
    type: String,
    maxlength: 140,
  },
  name: {
    type: String,
    maxlength: 30,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
  },
});

const port = process.env.PORT || 3000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/files", async (req, res) => {
  const files = await File.find().sort({ createdAt: "desc" }).limit(20).exec();
  res.json(files);
});

app.post("/files", async (req, res) => {
  const { name, description, type } = req.body;
  console.log(req.body);
  const file = new File({ name, description, type });
  try {
    const savedFile = await file.save();
    res.status(201).json(savedFile);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Could not upload file", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
