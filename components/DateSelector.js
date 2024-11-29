import { useState } from 'react';

export default function DateSelector({ value, onChange, showAnniversary = false }) {
  const [customDates, setCustomDates] = useState(value?.customDates || []);
  const [newDate, setNewDate] = useState('');
  const [newOccasion, setNewOccasion] = useState('');

  const occasionSuggestions = [
    'Weihnachten',
    'Ostern',
    'Geburtstag',
    'Jubiläum',
    'Hochzeitstag',
    'Namenstag',
    'Valentinstag',
    'Muttertag',
    'Vatertag',
    'Einweihungsfeier',
    'Verabschiedung',
    'Promotion',
    'Schulabschluss',
    'Ruhestand',
    'Taufe',
    'Kommunion',
    'Konfirmation'
  ];

  const handleAddCustomDate = () => {
    if (newDate && newOccasion) {
      const updatedDates = [...customDates, { date: newDate, occasion: newOccasion }];
      setCustomDates(updatedDates);
      setNewDate('');
      setNewOccasion('');
      onChange({
        ...value,
        customDates: updatedDates
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Geburtstag (optional)
        </label>
        <input
          type="date"
          value={value?.birthday || ''}
          onChange={(e) => onChange({ ...value, birthday: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {showAnniversary && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jahrestag (optional)
          </label>
          <input
            type="date"
            value={value?.anniversary || ''}
            onChange={(e) => onChange({ ...value, anniversary: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weitere wichtige Daten
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <div className="relative flex-1">
            <input
              type="text"
              value={newOccasion}
              onChange={(e) => setNewOccasion(e.target.value)}
              placeholder="Anlass"
              className="w-full p-2 border rounded"
              list="occasions"
            />
            <datalist id="occasions">
              {occasionSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>
          <button
            type="button"
            onClick={handleAddCustomDate}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            +
          </button>
        </div>

        {customDates.map((customDate, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span>{new Date(customDate.date).toLocaleDateString('de-DE')}</span>
            <span>{customDate.occasion}</span>
            <button
              type="button"
              onClick={() => {
                const updatedDates = customDates.filter((_, i) => i !== index);
                setCustomDates(updatedDates);
                onChange({ ...value, customDates: updatedDates });
              }}
              className="text-red-600 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
