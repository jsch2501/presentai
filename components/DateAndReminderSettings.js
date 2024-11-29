import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function DateAndReminderSettings({ value, onChange }) {
  const [selectedDate, setSelectedDate] = useState(null);
  
  const occasions = [
    { id: 'birthday', label: 'Geburtstag' },
    { id: 'anniversary', label: 'Jahrestag' },
    { id: 'christmas', label: 'Weihnachten' },
    { id: 'custom', label: 'Individuell' }
  ];

  const reminderTimes = [
    { days: 7, label: '1 Woche vorher' },
    { days: 14, label: '2 Wochen vorher' },
    { days: 30, label: '1 Monat vorher' }
  ];

  const handleReminderChange = (occasion, settings) => {
    onChange({
      ...value,
      reminders: {
        ...value?.reminders,
        [occasion]: settings
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Wichtige Daten</h3>
        {occasions.map(occasion => (
          <div key={occasion.id} className="mb-4">
            <label className="block text-sm mb-1">{occasion.label}</label>
            <DatePicker
              selected={value?.dates?.[occasion.id]}
              onChange={(date) => onChange({
                ...value,
                dates: {
                  ...value?.dates,
                  [occasion.id]: date
                }
              })}
              className="w-full p-2 border rounded"
              dateFormat="dd.MM.yyyy"
            />
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-2">Erinnerungen</h3>
        {occasions.map(occasion => (
          <div key={occasion.id} className="mb-4 p-3 border rounded">
            <div className="flex items-center justify-between">
              <span>{occasion.label}</span>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={value?.reminders?.[occasion.id]?.enabled}
                  onChange={(e) => handleReminderChange(occasion.id, {
                    ...value?.reminders?.[occasion.id],
                    enabled: e.target.checked
                  })}
                  className="mr-2"
                />
                Erinnerungen aktivieren
              </label>
            </div>

            {value?.reminders?.[occasion.id]?.enabled && (
              <div className="mt-2 space-y-2">
                <select
                  value={value?.reminders?.[occasion.id]?.daysInAdvance}
                  onChange={(e) => handleReminderChange(occasion.id, {
                    ...value?.reminders?.[occasion.id],
                    daysInAdvance: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                >
                  {reminderTimes.map(time => (
                    <option key={time.days} value={time.days}>
                      {time.label}
                    </option>
                  ))}
                </select>

                <div>
                  <label className="block text-sm mb-1">Benachrichtigung via</label>
                  <select
                    value={value?.reminders?.[occasion.id]?.method}
                    onChange={(e) => handleReminderChange(occasion.id, {
                      ...value?.reminders?.[occasion.id],
                      method: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="both">Beides</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

