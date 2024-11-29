import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { formData, answers, ratings } = req.body;

    // Request-Validierung
    if (!req.body) {
      return res.status(400).json({ message: 'Keine Daten erhalten' });
    }

    let prompt = `Generiere Geschenkvorschläge basierend auf:
- Beschreibung: ${formData.description}
- Budget: ${formData.budget}€
- Geschlecht: ${formData.gender || 'Nicht angegeben'}
- Altersgruppe: ${formData.ageGroup || 'Nicht angegeben'}
- Beruf: ${formData.occupation || 'Nicht angegeben'}
- Interessen: ${formData.interests || 'Nicht angegeben'}
- Beziehung: ${formData.relationship || 'Nicht angegeben'}

${answers ? `Zusätzliche Informationen aus den Fragen:
${Object.entries(answers).map(([k,v]) => `- ${v}`).join('\n')}` : ''}`;

    if (ratings && ratings.length > 0) {
      prompt += `\n\nBasierend auf dem bisherigen Feedback:
Positiv bewertete Vorschläge:
${ratings.filter(r => r.rating === 'like')
        .map(r => `- ${r.suggestion}`)
        .join('\n')}

Neutral bewertete Vorschläge:
${ratings.filter(r => r.rating === 'neutral')
        .map(r => `- ${r.suggestion}`)
        .join('\n')}

Negativ bewertete Vorschläge:
${ratings.filter(r => r.rating === 'dislike')
        .map(r => `- ${r.suggestion}`)
        .join('\n')}

Bitte generiere neue Vorschläge, die:
1. Ähnlich zu den positiv bewerteten Vorschlägen sind
2. Sich von den negativ bewerteten Vorschlägen unterscheiden
3. Die ursprünglichen Anforderungen (Budget, Alter, etc.) berücksichtigen`;
    }

    prompt += `\n\nBitte formatiere deine Antwort als JSON-Objekt im folgenden Format:
{
  "suggestions": [
    {
      "category": "Kategorie des Geschenks",
      "suggestion": "Detaillierte Beschreibung",
      "price": "Geschätzter Preis in €"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist ein präziser Geschenkberater. Antworte ausschließlich im spezifizierten JSON-Format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    console.log('OpenAI response:', content);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({
        message: 'Fehler beim Parsen der API-Antwort',
        error: process.env.NODE_ENV === 'development' ? parseError.message : undefined
      });
    }

    if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
      return res.status(500).json({
        message: 'Ungültiges Antwortformat von OpenAI',
        error: 'Suggestions array not found or invalid'
      });
    }

    return res.status(200).json({
      suggestions: parsedResponse.suggestions
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: 'Fehler bei der Ideengenerierung',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
