import { useState } from 'react';

export default function RelationshipSelector({ value, onChange }) {
  const [customInputs, setCustomInputs] = useState({});

  const relationshipStructure = {
    family: {
      label: 'Familie',
      options: [
        'Mutter', 'Vater', 'Bruder', 'Schwester', 'Opa', 'Oma', 
        'Onkel', 'Tante', 'Cousin/e', 'Entfernte/r Verwandte/r'
      ],
      allowMultiple: false
    },
    partnership: { // "Romantisch" wurde zu "Partnerschaft" geändert
      label: 'Partnerschaft',
      options: ['Partner/in', 'Verlobte/r', 'Ehepartner/in', 'Date'],
      allowMultiple: false
    },
    friends: {
      label: 'Freunde & Bekannte',
      options: ['Beste/r Freund/in', 'Gute/r Freund/in', 'Bekannte/r'],
      allowMultiple: true
    },
    professional: {
      label: 'Beruflich',
      options: ['Arbeitskollege/in', 'Chef/in', 'Mentor/in', 'Geschäftspartner/in'],
      allowMultiple: true
    }
  };

  const handleSelect = (category, option) => {
    const categoryConfig = relationshipStructure[category];
    const currentValue = value[category];

    // Wenn allowMultiple false ist, behandle es als Einzelauswahl
    if (!categoryConfig.allowMultiple) {
      // Wenn die Option bereits ausgewählt ist, deselektiere sie
      if (currentValue === option) {
        onChange({
          ...value,
          [category]: null
        });
      } else {
        // Sonst wähle die neue Option (ersetzt die alte)
        onChange({
          ...value,
          [category]: option
        });
      }
    } else {
      // Für Kategorien mit Mehrfachauswahl
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(option)) {
        onChange({
          ...value,
          [category]: currentArray.filter(item => item !== option)
        });
      } else {
        onChange({
          ...value,
          [category]: [...currentArray, option]
        });
      }
    }
  };

  const handleCustomInput = (category) => {
    const customValue = prompt(`Bitte geben Sie eine benutzerdefinierte ${relationshipStructure[category].label} ein:`);
    if (customValue && customValue.trim()) {
      const formattedValue = `custom:${customValue.trim()}`;
      
      // Speichere den custom input für die spezifische Kategorie
      setCustomInputs(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [formattedValue]: customValue.trim()
        }
      }));
      
      // Update den value für die spezifische Kategorie
      if (!relationshipStructure[category].allowMultiple) {
        onChange({
          ...value,
          [category]: formattedValue
        });
      } else {
        const currentArray = Array.isArray(value[category]) ? value[category] : [];
        onChange({
          ...value,
          [category]: [...currentArray, formattedValue]
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(relationshipStructure).map(([category, { label, options }]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-medium">{label}</h3>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(category, option)}
                className={`px-4 py-2 rounded-full ${
                  relationshipStructure[category].allowMultiple
                    ? Array.isArray(value[category]) && value[category]?.includes(option)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                    : value[category] === option
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
            
            {/* Zeige custom inputs für die aktuelle Kategorie */}
            {Array.isArray(value[category])
              ? value[category]
                  .filter(val => val.startsWith('custom:'))
                  .map(customVal => (
                    <button
                      key={customVal}
                      className="px-4 py-2 rounded-full bg-purple-600 text-white"
                    >
                      {customInputs[category]?.[customVal] || customVal.replace('custom:', '')}
                    </button>
                  ))
              : value[category]?.startsWith('custom:') && (
                  <button
                    className="px-4 py-2 rounded-full bg-purple-600 text-white"
                  >
                    {customInputs[category]?.[value[category]] || value[category].replace('custom:', '')}
                  </button>
                )}
            
            <button
              type="button"
              onClick={() => handleCustomInput(category)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              + Andere
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
