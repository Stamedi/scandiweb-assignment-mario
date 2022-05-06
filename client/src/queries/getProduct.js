import { client, Query } from '@tilework/opus';

const getProduct = async (product) => {
  try {
    client.setEndpoint('http://localhost:4000/graphql');

    const queryProducts = new Query('product', true)
      .addArgument('id', 'String!', product)
      .addFieldList([
        'id',
        'name',
        'inStock',
        'gallery',
        'description',
        'category',
        'attributes {id, name, type, items {value, id}}',
        'prices {currency {label, symbol}, amount}',
        'brand',
      ]);

    return await client.post(queryProducts);
  } catch (err) {
    console.log('Product error: ' + err);
  }
};

export default getProduct;
