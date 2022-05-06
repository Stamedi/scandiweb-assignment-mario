import { client, Field, Query } from '@tilework/opus';

const getCategory = async (category) => {
  try {
    client.setEndpoint('http://localhost:4000/graphql');

    const queryCategory = new Query('category', true)
      .addArgument('input', 'CategoryInput', { title: category }, 'String!')
      .addField(
        new Field('products', true).addFieldList([
          'id',
          'name',
          'inStock',
          'gallery',
          'description',
          'category',
          'attributes{id, items{value, id}}',
          'prices{amount, currency{label, symbol}}',
          'brand',
        ])
      );

    return await client.post(queryCategory);
  } catch (err) {
    console.log(`Category error: ${err}`);
  }
};

export default getCategory;
