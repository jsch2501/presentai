import { CalendarIcon, ClockIcon, GiftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function ProfileCard({ profile, onEdit, onDelete }) {
  const router = useRouter();

  const getNextEvent = () => {
    const events = [
      ...(profile.occasions?.birthday ? [{ date: new Date(profile.occasions.birthday), type: 'Geburtstag' }] : []),
      ...(profile.occasions?.anniversary ? [{ date: new Date(profile.occasions.anniversary), type: 'Jahrestag' }] : []),
      ...(profile.occasions?.customDates || []).map(cd => ({ 
        date: new Date(cd.date), 
        type: cd.occasion 
      }))
    ];

    const now = new Date();
    const futureEvents = events
      .map(event => {
        const nextDate = new Date(event.date);
        nextDate.setFullYear(now.getFullYear());
        if (nextDate < now) {
          nextDate.setFullYear(now.getFullYear() + 1);
        }
        return { ...event, date: nextDate };
      })
      .sort((a, b) => a.date - b.date);

    return futureEvents[0];
  };

  const nextEvent = getNextEvent();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-gray-600">{profile.relationship?.specific}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/profile-management/${profile.id}/edit`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Bearbeiten
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            Löschen
          </button>
        </div>
      </div>

      {nextEvent && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>Nächstes Ereignis: {nextEvent.type}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>
              {nextEvent.date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}

      {profile.history?.previousGifts?.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center text-gray-600 mb-2">
            <GiftIcon className="h-5 w-5 mr-2" />
            <span>Letzte Geschenke:</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {profile.history.previousGifts.slice(-3).map((gift, index) => (
              <li key={index}>
                {gift.gift} ({new Date(gift.date).toLocaleDateString('de-DE')})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
