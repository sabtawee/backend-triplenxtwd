const express = require("express");
const cors = require("cors");
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");


const ProductRouter = require("./routes/ProductRouter");
const ImageRouter = require("./routes/ImageRouter");
const ThaiwatRouter = require("./routes/ThaiwatRouter");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  basicAuth({
    users: { ApiKey: "hup91P^EveCq001ba@7aR6qOan5KWmH#96NW" },
    hallenge: true,
    unauthorizedResponse: (req) => {
      return req.auth
        ? "Credentials " + req.auth.user + ":" + req.auth.password + " rejected"
        : "No credentials provided";
    },
  })
);

app.use(express.static(path.join(__dirname, "uploads")));

// ตั้งค่าการอัปโหลดภาพ
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/thaiwat", ThaiwatRouter);

app.use("/api/images", ImageRouter);

app.use("/api/products", upload.fields([
    {
        name: "pd_picture",
        maxCount: 1
    },
    {
        name: "pd_picture_1",
        maxCount: 1
    },
    {
        name: "pd_picture_2",
        maxCount: 1
    },
    {
        name: "pd_picture_3",
        maxCount: 1
    },
    {
        name: "pd_picturebig",
        maxCount: 1
    }
]), ProductRouter);




app.listen(process.env.PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT} || http://localhost:${process.env.PORT}`
  );
});
