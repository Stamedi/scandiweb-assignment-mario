import { client, Query } from '@tilework/opus';

const getCurrencies = async () => {
  try {
    client.setEndpoint('http://localhost:4000/graphql');

    const queryCurrencies = new Query('currencies', true).addFieldList(['label', 'symbol']);

    return await client.post(queryCurrencies);
  } catch (err) {
    console.log(`Currencies error: ${err}`);
  }
};

export default getCurrencies;
