import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { description, budget, gender, ageGroup, occupation, interests, relationship } = req.body;

    // Debug-Logging
    console.log('Generating questions for:', {
      description,
      budget,
      gender,
      ageGroup,
      occupation,
      interests,
      relationship
    });

    const prompt = `Als erfahrener Geschenkberater, generiere bitte 5 relevante Fragen mit jeweils 3 passenden Antwortvorschlägen, um das perfekte Geschenk zu finden:

Personenbeschreibung:
- ${description}
- Budget: ${budget}€
- Geschlecht: ${gender || 'Nicht angegeben'}
- Altersgruppe: ${ageGroup || 'Nicht angegeben'}
- Beruf: ${occupation || 'Nicht angegeben'}
- Interessen: ${interests || 'Nicht angegeben'}
- Beziehung: ${relationship || 'Nicht angegeben'}

Bitte formatiere deine Antwort als JSON-Objekt im folgenden Format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Deine Frage hier?",
      "suggestions": ["Vorschlag 1", "Vorschlag 2", "Vorschlag 3"]
    }
  ]
}

Die Fragen und Vorschläge sollten:
1. Spezifisch und relevant sein
2. Zum Kontext der Person passen
3. Helfen, die Geschenkauswahl zu verfeinern

Wichtig: Antworte NUR mit dem JSON-Objekt, keine zusätzlichen Erklärungen.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist ein präziser Geschenkberater, der ausschließlich im spezifizierten JSON-Format antwortet."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('OpenAI Raw Response:', rawResponse);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Failed to parse:', rawResponse);
      return res.status(500).json({
        message: 'Fehler beim Parsen der API-Antwort',
        debug: process.env.NODE_ENV === 'development' ? rawResponse : undefined
      });
    }

    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      console.error('Invalid response format:', parsedResponse);
      return res.status(500).json({
        message: 'Ungültiges Antwortformat von OpenAI',
        debug: process.env.NODE_ENV === 'development' ? parsedResponse : undefined
      });
    }

    // Stelle sicher, dass jede Frage die richtige Struktur hat
    const validatedQuestions = parsedResponse.questions.map((q, index) => ({
      id: q.id || `q${index + 1}`,
      question: q.question,
      suggestions: q.suggestions || []
    }));

    return res.status(200).json({ questions: validatedQuestions });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: 'Fehler bei der Fragengenerierung',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
