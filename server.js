// Importing the required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { ApolloServer } = require("apollo-server-express");
const { ApolloError } = require("apollo-server-errors");
const { typeDefs } = require("./schema");
const { Query } = require("./resolvers/Query");
const { Mutation } = require("./resolvers/Mutation");
const { Category } = require("./resolvers/Category");
const { Product } = require("./resolvers/Product");
const ProductModel = require("./models/productsModel");
const CategoryModel = require("./models/categoriesModel");
const ReviewModel = require("./models/reviewsModel");
const PeopleModel = require("./models/peopleModel");

// Create an instance of Express
const app = express();
app.use(express.json());

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  const user = await PeopleModel.findOne({ username });

  // throw an error the user wasn't found
  if (!user) {
    return res.status(400).json({ error: "Invalid login credentials" });
  }

  // check the user's password
  const valid = await bcrypt.compare(password, user.password);

  // Just for testing purposes, we will use the below code
  //const valid = password === user.password;

  // throw an error if the password was incorrect
  if (!valid) {
    return res.status(400).json({ error: "Invalid login credentials" });
  }

  // create a token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // return the token
  res.json({ token });
});

// handling the uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("DB connection successful !"));

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Product,
    Category,
  },
  introspection: true,
  context: async ({ req }) => {
    const token = req.headers.authorization;
    let user = null;

    if (!token) {
      throw new ApolloError("No token provided", "UNAUTHORIZED", {
        statusCode: 401,
      });
    }

    if (token) {
      try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        user = await PeopleModel.findById(decoded.id);

        if (!user) {
          throw new ApolloError("Invalid Token!!", "UNAUTHORIZED", {
            statusCode: 401,
          });
        }
      } catch (err) {
        throw new ApolloError("Invalid Token!!", "UNAUTHORIZED", {
          statusCode: 401,
        });
      }
    }
    return {
      ProductModel,
      CategoryModel,
      ReviewModel,
      PeopleModel,
      user,
    };
  },
});

server.start().then(() => {
  console.log("Apollo server started...");
  server.applyMiddleware({ app });
  const port = process.env.PORT || 2000;
  // starting the server
  app.listen(port, () => {
    console.log(`App running at port: ${port}...`);
  });
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.stop().then(() => {
    mongoose.connection.close(() => {
      process.exit(1);
    });
  });
});
