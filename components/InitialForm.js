import { useState } from 'react';
import styles from '../styles/Form.module.css';

export default function InitialForm({ onSubmit, isLoading }) {
  // Alle Formularstates in einer Komponente definieren
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [occupation, setOccupation] = useState('');
  const [interests, setInterests] = useState('');
  const [relationship, setRelationship] = useState('');

  const budgetOptions = [
    { value: '0-25', label: 'Bis 25€' },
    { value: '25-50', label: '25€ - 50€' },
    { value: '50-100', label: '50€ - 100€' },
    { value: '100-200', label: '100€ - 200€' },
    { value: '200+', label: 'Über 200€' }
  ];

  const ageGroupOptions = [
    { value: '0-12', label: 'Kind (0-12)' },
    { value: '13-17', label: 'Teenager (13-17)' },
    { value: '18-25', label: 'Junger Erwachsener (18-25)' },
    { value: '26-35', label: 'Erwachsener (26-35)' },
    { value: '36-50', label: 'Mittleres Alter (36-50)' },
    { value: '51+', label: 'Senior (51+)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      description,
      budget,
      selectedCategories,
      gender,
      ageGroup,
      occupation,
      interests,
      relationship
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Finden Sie das perfekte Geschenk
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Beschreibung der Person
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            required
            placeholder="Beschreiben Sie die Person, für die Sie ein Geschenk suchen..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <div className="grid grid-cols-3 gap-2">
            {budgetOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBudget(option.value)}
                className={`p-2 rounded-md border ${
                  budget === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Geschlecht
          </label>
          <div className="space-x-4">
            {['männlich', 'weiblich', 'divers'].map(option => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  value={option}
                  checked={gender === option}
                  onChange={(e) => setGender(e.target.value)}
                  className={styles.radioInput}
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Altersgruppe
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ageGroupOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAgeGroup(option.value)}
                className={`p-2 rounded-md border ${
                  ageGroup === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Beruf
          </label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Beruf, z.B. Lehrer, Ingenieurin, Student"
            className={styles.input}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Interessen
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Hobbies, Interessen, Vorlieben"
            className={styles.input}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Beziehung
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">Bitte wählen</option>
            <option value="family">Familie</option>
            <option value="friend">Freund/in</option>
            <option value="partner">Partner/in</option>
            <option value="colleague">Kollege/in</option>
            <option value="other">Sonstige</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Weiter
        </button>
      </form>
    </div>
  );
}
