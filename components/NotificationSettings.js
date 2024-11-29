export default function NotificationSettings({ value = {}, onChange }) {
  const handleChange = (changes) => {
    onChange({
      ...value,
      ...changes
    });
  };

  const handleContactInfoChange = (field, fieldValue) => {
    handleChange({
      contactInfo: {
        ...(value.contactInfo || {}),
        [field]: fieldValue
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="notifications-enabled"
          checked={value.enabled || false}
          onChange={(e) => handleChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-purple-600"
        />
        <label htmlFor="notifications-enabled" className="ml-2 text-sm">
          Erinnerungen aktivieren
        </label>
      </div>

      {value.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benachrichtigungsmethode
            </label>
            <select
              value={value.method || 'email'}
              onChange={(e) => handleChange({ method: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="email">E-Mail</option>
              <option value="push">Push-Benachrichtigung</option>
            </select>
          </div>

          {value.method === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail Adresse
              </label>
              <input
                type="email"
                value={value.contactInfo?.email || ''}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {value.method === 'push' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobilnummer
              </label>
              <input
                type="tel"
                value={value.contactInfo?.phone || ''}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                placeholder="+49"
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Erinnerungen für:
            </label>
            {[
              { id: 'birthday', label: 'Geburtstag' },
              { id: 'anniversary', label: 'Jahrestag' },
              ...value.occasions?.customDates?.map(date => ({
                id: `custom-${date.occasion}`,
                label: date.occasion
              })) || []
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`reminder-${id}`}
                  checked={(value.reminders || []).includes(id)}
                  onChange={(e) => {
                    const newReminders = e.target.checked
                      ? [...(value.reminders || []), id]
                      : (value.reminders || []).filter(r => r !== id);
                    handleChange({ reminders: newReminders });
                  }}
                  className="h-4 w-4 text-purple-600 rounded cursor-pointer"
                />
                <label htmlFor={`reminder-${id}`} className="ml-2 cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
