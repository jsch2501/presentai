import { useState } from 'react';

export default function CustomDates({ value, onChange }) {
  const [newDate, setNewDate] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const maxDates = 5;

  const handleAddDate = () => {
    if (!newDate || !newOccasion) return;
    
    const newCustomDate = {
      id: `custom-${Date.now()}`,
      date: newDate,
      occasion: newOccasion
    };

    // Stelle sicher, dass customDates immer ein Array ist
    const currentCustomDates = Array.isArray(value.customDates) ? value.customDates : [];
    
    const updatedDates = [...currentCustomDates, newCustomDate];

    onChange({
      ...value,
      customDates: updatedDates,
      notifications: {
        ...value.notifications,
        reminders: [
          ...(value.notifications?.reminders || []),
          newCustomDate.id
        ]
      }
    });

    setNewDate('');
    setNewOccasion('');
  };

  const handleRemoveDate = (dateToRemove) => {
    // Stelle sicher, dass wir mit einem Array arbeiten
    const currentDates = Array.isArray(value.customDates) ? value.customDates : [];
    const updatedDates = currentDates.filter(date => date.id !== dateToRemove.id);

    onChange({
      ...value,
      customDates: updatedDates,
      notifications: {
        ...value.notifications,
        reminders: (value.notifications?.reminders || [])
          .filter(id => id !== dateToRemove.id)
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          value={newOccasion}
          onChange={(e) => setNewOccasion(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Bezeichnung des Anlasses"
        />
        <button
          type="button"
          onClick={handleAddDate}
          disabled={!newDate || !newOccasion || (value.customDates || []).length >= maxDates}
          className={`p-2 rounded-lg ${
            !newDate || !newOccasion || (value.customDates || []).length >= maxDates
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          +
        </button>
      </div>

      <div className="space-y-2">
        {(value.customDates || []).map((customDate) => (
          <div 
            key={customDate.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div>
              <span className="font-medium">
                {new Date(customDate.date).toLocaleDateString('de-DE')}
              </span>
              <span className="ml-2 text-gray-600">
                {customDate.occasion}
              </span>
            </div>
            <button
              onClick={() => handleRemoveDate(customDate)}
              className="text-red-600 hover:text-red-700"
              title="Entfernen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
