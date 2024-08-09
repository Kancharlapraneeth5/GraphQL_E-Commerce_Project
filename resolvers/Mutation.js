const bcrypt = require("bcryptjs");
const { ApolloError } = require("apollo-server-errors");
const { v4: uuid } = require("uuid");

exports.Mutation = {
  addNewCategory: async (parent, { input }, context) => {
    if (context.user.role === "admin") {
      const { name } = input;
      const newCategory = {
        id: uuid(),
        name,
      };

      try {
        await context.CategoryModel.create(newCategory);
        return newCategory;
      } catch (err) {
        if (err.errmsg.includes("duplicate key error") && err.code === 11000) {
          throw new ApolloError("Category name must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },
  addNewProduct: async (parent, { input }, context) => {
    if (context.user.role === "admin") {
      const { name, image, price, onSale, quantity, categoryId, description } =
        input;
      const newProduct = {
        id: uuid(),
        name,
        image,
        price,
        onSale,
        quantity,
        categoryId,
        description,
      };

      try {
        await context.ProductModel.create(newProduct);
        return newProduct;
      } catch (err) {
        if (err.errmsg.includes("duplicate key error") && err.code === 11000) {
          throw new ApolloError("Product name must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  addNewProducts: (parent, { input }, context) => {
    if (context.user.role === "admin") {
      const newProducts = input.map((productInput) => {
        const {
          name,
          image,
          price,
          onSale,
          quantity,
          categoryId,
          description,
        } = productInput;
        const newProduct = {
          id: uuid(),
          name,
          image,
          price,
          onSale,
          quantity,
          categoryId,
          description,
        };

        return newProduct;
      });

      context.ProductModel.create(newProducts);
      return newProducts;
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  addNewReview: async (parent, { input }, context) => {
    if (context.user.role === "admin") {
      const { date, title, comment, rating, productID } = input;
      const newReview = {
        id: uuid(),
        date,
        title,
        comment,
        rating,
        productID,
      };

      try {
        await context.ReviewModel.create(newReview);
        return newReview;
      } catch (err) {
        if (err.errmsg.includes("duplicate key error") && err.code === 11000) {
          throw new ApolloError("Review must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  addNewUser: async (parent, { input }, context) => {
    console.log("the context is..." + context.user);
    console.log("the context is..." + context.user.role);

    if (context.user.role === "admin") {
      const { username, password, role } = input;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: uuid(),
        username,
        password: hashedPassword,
        role,
      };

      try {
        await context.PeopleModel.create(newUser);
        return newUser;
      } catch (err) {
        if (err.errmsg.includes("duplicate key error") && err.code === 11000) {
          throw new ApolloError("Username must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  deleteCategory: async (parent, { id }, context) => {
    if (context.user.role === "admin") {
      try {
        await context.CategoryModel.findByIdAndDelete(id);
        await context.ProductModel.updateMany(
          { categoryId: id },
          { $set: { categoryId: null } }
        );
        return true;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while deleting the category",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },
  deleteProduct: async (parent, { id }, context) => {
    if (context.user.role === "admin") {
      try {
        await context.ProductModel.findByIdAndDelete(id);
        await context.ReviewModel.deleteMany({ productId: id });
        return true;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while deleting the product",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },
  deleteReview: async (parent, { id }, context) => {
    if (context.user.role === "admin") {
      try {
        await context.ReviewModel.findByIdAndDelete(id);
        return true;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while deleting the review",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },
  updateCategory: async (parent, { id, input }, context) => {
    if (context.user.role === "admin") {
      try {
        const updatedCategory = await context.CategoryModel.findByIdAndUpdate(
          id,
          input,
          {
            new: true,
          }
        );
        return updatedCategory;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while updating the category",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },
};
