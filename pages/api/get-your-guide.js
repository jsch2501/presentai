import axios from 'axios';

const API_KEY = 'giftlyai'; // Verwenden Sie den korrekten API-Schlüssel

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { location, date } = req.query;

    const options = {
      method: 'GET',
      url: 'https://api.getyourguide.com/1/tours',
      headers: {
        'X-ACCESS-TOKEN': API_KEY
      },
      params: {
        location: location,
        date: date
      }
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      res.status(error.response ? error.response.status : 500).json({
        error: error.message,
        details: error.response ? error.response.data : 'Keine zusätzlichen Details verfügbar'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
