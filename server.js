/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Bhargav Rasesh Patel Student ID: 116520248 Date: March 25, 2025
*
* Published URL: https://web-700-a3-osl2a1cv9-bhargav-patels-projects-1628d3a0.vercel.app/
*
********************************************************************************/

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const path = require("path");

const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
// express.urlencoded({ extended: true })
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about")
});

app.get("/lego/addSet", async (req, res) => {
  let getAllThemes = await legoData.getAllThemes()
  // console.log("All themes" ,getAllThemes);
  res.render("addSet", { themes: getAllThemes })
})

app.post("/lego/addSet", async (req, res) => {
  try {
    console.log("Received set data:", req.body);
    await legoData.addSet(req.body); 
    res.redirect('/lego/sets');
  } catch (error) {
    console.error("Error adding set:", error);
    res.status(400).send("Error adding Lego set: " + error.message);
  }
});

app.get("/lego/sets", async (req, res) => {

  try {
    if (req.query.theme) {
      let legoSets = await legoData.getSetsByTheme(req.query.theme);
      // console.log(legoSets)
      res.render("sets", { sets: legoSets });

    } else {
      let legoSets = await legoData.getAllSets();
      // console.log(legoSets)
      res.render("sets", { sets: legoSets });
    }
  } catch (err) {
    res.status(404).send(err);
  }

});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    let legoSet = await legoData.getSetByNum(req.params.set_num);
    console.log(legoSet)
    res.render("set", { set: legoSet });
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/deleteSet/:set_num", async (req, res) => {
    // console.log("Deleted successfully", req.params.set_num)
    legoData.deleteSetByNum(req.params.set_num).then(() => res.redirect("/lego/sets"))
    .catch((error) => {
      res.status(404).send(error);
    });
    
});

app.post("/lego/add-test", async (req, res) => {
  // let testSet = {
  //   set_num: "123",
  //   name: "testSet name",
  //   year: "2024",
  //   theme_id: "366",
  //   num_parts: "123",
  //   img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  // }

  console.log(req.body)

  legoData.addSet(testSet).then(() => {
    res.redirect('/lego/sets')
  }).catch((error) => {
    res.status(422).send(error);
  })
})

app.use((err, req, res, next) => {
  res.render("404", { page: req.path });
  // res.render("404", { message: err.message || "An error occurred" });
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => console.log(`server listening on port: ${HTTP_PORT}`));
}).catch(err => {
  console.log(err);
});