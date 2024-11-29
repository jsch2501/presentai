import { useState } from 'react';
import styles from '../styles/Form.module.css';

export default function GiftIdeas({ ideas = [], onRegenerateIdeas, onBack, isLoading }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [ratings, setRatings] = useState({});
  const [hasRated, setHasRated] = useState(false);
  const ideasPerPage = 3;

  // Debug-Logging
  console.log('Received ideas:', ideas);

  if (!ideas || ideas.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <span className="mr-2">←</span> Zurück zu den Fragen
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">
            Keine Geschenkvorschläge gefunden. Bitte versuchen Sie es erneut.
          </p>
          <button
            onClick={onRegenerateIdeas}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isLoading ? 'Generiere Vorschläge...' : 'Neue Vorschläge generieren'}
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(ideas.length / ideasPerPage);
  const currentIdeas = ideas.slice(
    currentPage * ideasPerPage,
    (currentPage + 1) * ideasPerPage
  );

  const handleRate = (ideaId, rating) => {
    setRatings(prev => {
      const newRatings = {
        ...prev,
        [ideaId]: {
          suggestion: ideas[ideaId].suggestion,
          rating: rating
        }
      };
      setHasRated(true);
      return newRatings;
    });
  };

  const handleRegenerateWithFeedback = () => {
    // Formatiere die Bewertungen als Array
    const formattedRatings = Object.entries(ratings).map(([id, data]) => ({
      id,
      suggestion: data.suggestion,
      rating: data.rating
    }));
    
    console.log('Sending feedback:', formattedRatings);
    onRegenerateIdeas(formattedRatings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <span className="mr-2">←</span> Zurück zu den Fragen
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">
        Ihre personalisierten Geschenkvorschläge
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {currentIdeas.map((idea, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm text-blue-600 mb-2">{idea.category}</div>
            <h3 className="font-semibold mb-3">{idea.suggestion}</h3>
            <div className="text-green-600 font-medium mb-4">{idea.price}€</div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleRate(index, 'dislike')}
                className={`p-2 rounded-full transition-colors ${
                  ratings[index]?.rating === 'dislike' ? 'bg-red-100' : ''
                }`}
                title="Gefällt mir nicht"
              >
                👎
              </button>
              <button
                onClick={() => handleRate(index, 'neutral')}
                className={`p-2 rounded-full transition-colors ${
                  ratings[index]?.rating === 'neutral' ? 'bg-gray-100' : ''
                }`}
                title="Neutral"
              >
                😐
              </button>
              <button
                onClick={() => handleRate(index, 'like')}
                className={`p-2 rounded-full transition-colors ${
                  ratings[index]?.rating === 'like' ? 'bg-green-100' : ''
                }`}
                title="Gefällt mir"
              >
                👍
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md ${
              currentPage === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Vorherige
          </button>
          <span className="py-2">
            Seite {currentPage + 1} von {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages - 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Nächste
          </button>
        </div>
      )}

      {hasRated && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleRegenerateWithFeedback}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Generiere neue Vorschläge...' : 'Neue Vorschläge basierend auf Feedback'}
          </button>
        </div>
      )}
    </div>
  );
}
