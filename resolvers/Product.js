exports.Product = {
  category: async (parent, args, context) => {
    const categoryId = parent.categoryId;
    try {
      const Category = await context.CategoryModel.findById(categoryId);
      return Category;
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

  reviews: async ({ id }, args, context) => {
    try {
      const reviews = await context.ReviewModel.find({ productId: id });
      return reviews;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the reviews",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },
};
