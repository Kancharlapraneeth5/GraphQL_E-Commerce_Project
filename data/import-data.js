const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const Category = require("./../models/categoriesModel");
const Product = require("./../models/productsModel");
const Review = require("./../models/reviewsModel");
const People = require("../models/peopleModel");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => console.log("DB connection successful !"));

const dataMap = {
  "Categories.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/Categories.json`, "utf-8")),
    model: Category,
  },
  "Products.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/Products.json`, "utf-8")),
    model: Product,
  },
  "Reviews.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/Reviews.json`, "utf-8")),
    model: Review,
  },
  "People.json": {
    data: JSON.parse(fs.readFileSync(`${__dirname}/People.json`, "utf-8")),
    model: People,
  },
};

const importData = async (model, data) => {
  try {
    await model.create(data);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async (model) => {
  try {
    await model.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (dataMap[process.argv[2]]) {
  if (process.argv[3] === "--import") {
    importData(dataMap[process.argv[2]].model, dataMap[process.argv[2]].data);
  } else if (process.argv[3] === "--delete") {
    deleteData(dataMap[process.argv[2]].model);
  }
}
