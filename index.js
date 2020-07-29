const express = require("express");
const {spawn} = require("child_process");

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  res.redirect(`/result?text=${req.body.text}`);
});

app.get("/result", (req, res) => {
  console.log(req.query.text);
  var dataToSend;
  const python = spawn("python", ["senti.py", req.query.text]);

  python.stdout.on("data", (data) => {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });

  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.render("final", {result: dataToSend});
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
