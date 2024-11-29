import { useState } from 'react';
import axios from 'axios';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`/api/amazon-search?query=${query}`);
      console.log('Frontend-Antwort:', JSON.stringify(response.data, null, 2));
      setResults(response.data.products || []);
    } catch (error) {
      console.error('Fehler bei der Suche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Produkt suchen..."
        />
        <button type="submit">Suchen</button>
      </form>

      {loading && <p>Laden...</p>}

      {results.length === 0 && !loading && <p>Keine Ergebnisse gefunden.</p>}

      <ul>
        {results.map((product) => (
          <li key={product.asin}>
            <h3>{product.product_title}</h3>
            {product.product_photo && <img src={product.product_photo} alt={product.product_title} style={{maxWidth: '100px'}} />}
            <p>Preis: {product.product_price 
              ? `${product.product_price} ${product.currency}` 
              : 'Nicht verfügbar'}
            </p>
            <p>Bewertung: {product.product_star_rating 
              ? `${product.product_star_rating} von 5 Sternen (${product.product_num_ratings} Bewertungen)` 
              : 'Keine Bewertung'}
            </p>
            {product.product_url && (
              <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                Zum Produkt
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
