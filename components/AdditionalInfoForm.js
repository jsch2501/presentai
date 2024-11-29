import { useState } from 'react';

const standardQuestions = [
  {
    id: 'hasChildren',
    question: 'Hat die Person Kinder?'
  },
  {
    id: 'isMarried',
    question: 'Ist die Person verheiratet?'
  },
  {
    id: 'hasPets',
    question: 'Hat die Person Haustiere?'
  },
  {
    id: 'likesReading',
    question: 'Liest die Person gerne?'
  },
  {
    id: 'likesSports',
    question: 'Treibt die Person gerne Sport?'
  },
  {
    id: 'likesMusic',
    question: 'Mag die Person Musik?'
  }
];

export default function AdditionalInfoForm({ value, onChange, onBack, onSave }) {
  const handleQuestionChange = (questionId, answer) => {
    onChange({
      ...value,
      additionalInfo: {
        ...value.additionalInfo,
        questions: {
          ...value.additionalInfo.questions,
          [questionId]: answer
        }
      }
    });
  };

  const handleFreeformChange = (text) => {
    onChange({
      ...value,
      additionalInfo: {
        ...value.additionalInfo,
        freeform: text
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Weitere Angaben</h2>
      
      <div className="space-y-4">
        {standardQuestions.map(({ id, question }) => (
          <div key={id} className="space-y-2">
            <p className="font-medium">{question}</p>
            <div className="flex gap-2">
              {['Ja', 'Nein', 'Weiß nicht'].map((answer) => (
                <button
                  key={answer}
                  onClick={() => handleQuestionChange(id, answer)}
                  className={`px-4 py-2 rounded-full ${
                    value.additionalInfo?.questions?.[id] === answer
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">
          Weitere Informationen (optional)
        </label>
        <textarea
          value={value.additionalInfo?.freeform || ''}
          onChange={(e) => handleFreeformChange(e.target.value)}
          className="w-full p-2 border rounded min-h-[100px]"
          placeholder="Hier können Sie weitere Informationen zur Person eingeben..."
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Zurück
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
