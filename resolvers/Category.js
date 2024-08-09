exports.Category = {
  // Modify the below method with MongoDB collections
  products: async ({ id }, { filter }, context) => {
    let query = { categoryId: id };

    if (filter) {
      if (filter.onSale !== undefined) {
        query.onSale = filter.onSale;
      }
    }

    try {
      const filterCategoryProducts = await context.ProductModel.find(query);
      return filterCategoryProducts;
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
};
