const express = require("express");
const Controller = require("./controllers/controller");
const app = express();
const port = 3000;
const session = require("express-session");
const path = require("path");
const fileUpload = require("express-fileupload");

app.use(fileUpload());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", Controller.showLandingPage);
app.get("/register", Controller.showFormRegistrasi);
app.post("/register", Controller.submitRegister);
app.get("/login", Controller.showFormLogin);
app.post("/login", Controller.submitLogin);
app.get("/home", Controller.readAllPost);
app.post("/home", Controller.submitAddPosting);
app.get("/profile", Controller.readUserData);
app.post("/profile", Controller.submitEdited);
app.get("/gantiPassword", Controller.showGantiPassword);
app.post("/gantiPassword", Controller.submitGantiPassword);
app.get("/profile/delete/:id", Controller.deletePosting);
app.get("/logout", Controller.logout);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
