const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const path = require("path");

const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/lego/sets", async (req, res) => {

  try {
    if (req.query.theme) {
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.send(sets);

    } else {
      let sets = await legoData.getAllSets();
      res.send(sets);
    }
  } catch (err) {
    res.status(404).send(err);
  }

});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.set_num);
    res.send(set);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/add-test", async (req, res) => {
  let testSet = {
    set_num: "123",
    name: "testSet name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  }

  legoData.addSet(testSet).then(() => {
    res.redirect('/lego/sets')
  }).catch((error) => {
    res.status(422).send(error);
  })
})

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => console.log(`server listening on port: ${HTTP_PORT}`));
}).catch(err => {
  console.log(err);
});