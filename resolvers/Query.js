exports.Query = {
  // In Apollo Server, each field in your schema has a corresponding resolver function.
  // A resolver function is responsible for fetching the data for its field. The resolver function takes
  // four positional arguments:

  // parent-> This is the result returned from the resolver for the parent field.
  // For a root field (a field on the Query, Mutation, or Subscription type), parent is undefined.

  // args-> This is an object that contains all GraphQL arguments provided for the field. For example,
  // if the field was called with myField(arg1: "value"), the args object is { arg1: "value" }.

  // context-> This is an object shared by all resolvers in a particular query.
  // It's used to store per-request state, including authentication information, dataloader instances,
  // and anything else that should be taken into account when resolving the query

  // info-> his argument contains information about the execution state of the query.
  // It includes the field name, path to the field from the root, and more. It's mostly used in advanced cases,
  // like schema stitching

  // THE ORDER OF THE PARAMETERS IN THE RESOLVER FUNCTION IS VERY IMPORTANT!!!!!!

  products: async (parent, { filter }, context) => {
    let filterProducts;

    try {
      if (filter) {
        if (filter.onSale === true) {
          filterProducts = await context.ProductModel.find({ onSale: true });
        } else if (filter.onSale === false) {
          filterProducts = await context.ProductModel.find({ onSale: false });
        } else {
          filterProducts = await context.ProductModel.find();
        }
      }
      return filterProducts;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the products",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  product: async (parent, args, context) => {
    const productID = args.id;
    try {
      const result = await context.ProductModel.findById(productID);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the product",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  productByName: async (parent, args, context) => {
    const productName = args.name;
    try {
      const result = await context.ProductModel.findOne({ name: productName });
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the product by name",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  categories: async (parent, args, context) => {
    try {
      const result = await context.CategoryModel.find();
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the categories",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  category: async (parent, args, context) => {
    const { id } = args;
    try {
      const result = await context.CategoryModel.findById(id);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the category",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  categoryByName: async (parent, args, context) => {
    const { name } = args;
    try {
      const result = await context.CategoryModel.findOne({ name });
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the category by name",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },
};
