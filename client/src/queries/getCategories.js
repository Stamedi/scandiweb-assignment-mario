import { client, Field, Query } from '@tilework/opus';

const getCategories = async () => {
  try {
    client.setEndpoint('http://localhost:4000/graphql');

    const queryCategories = new Query('categories', true)
      .addField(new Field('name'))
      .addField(
        new Field('products', true).addFieldList([
          'id',
          'name',
          'inStock',
          'gallery',
          'description',
          'category',
          'attributes {id, items {value, id}}',
          'prices {currency {label, symbol}, amount}',
          'brand',
        ])
      );

    return await client.post(queryCategories);
  } catch (err) {
    console.log('Categories error: ' + err);
  }
};

export default getCategories;
