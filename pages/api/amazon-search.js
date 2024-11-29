import axios from 'axios';

const RAPIDAPI_KEY = '5c8cc874b3mshe52a86d4373606dp12ce86jsn4632df332a1a';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query } = req.query;

  try {
    const response = await axios.get('https://real-time-amazon-data.p.rapidapi.com/search', {
      params: {
        query,
        country: 'DE',
        category_id: 'aps'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
      }
    });

    console.log('API Response:', response.data);

    if (!response.data || !response.data.results) {
      throw new Error('Keine Ergebnisse gefunden');
    }

    const products = response.data.results.map(item => ({
      product_title: item.name,
      product_price: item.price,
      product_photo: item.image,
      product_url: item.url,
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Amazon API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Fehler bei der Produktsuche', error: error.message });
  }
}
