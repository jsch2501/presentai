import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { originalIdeas, feedback, description, budget, categories, answers, nearestCity } = req.body;

    const positiveIdeas = originalIdeas.filter((idea, index) => feedback[index]);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist ein kreativer Geschenkberater. Generiere verfeinerte Geschenkvorschläge basierend auf vorherigem Feedback."
        },
        {
          role: "user",
          content: `Generiere 5 neue Geschenkideen basierend auf diesen Informationen:
            - Beschreibung: ${description}
            - Budget: ${budget}€
            - Kategorien: ${categories.join(', ')}
            - Zusätzliche Informationen: ${Object.entries(answers).map(([k,v]) => `${k}: ${v}`).join(', ')}
            - Stadt: ${nearestCity}
            
            Beliebte vorherige Vorschläge:
            ${positiveIdeas.map(idea => `- ${idea.category}: ${idea.suggestion}`).join('\n')}
            
            Generiere ähnliche aber neue Vorschläge im Format "Kategorie: Beschreibung".`
        }
      ]
    });

    const suggestions = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [category, ...descriptionParts] = line.split(':');
        return {
          category: category.trim().replace(/^\d+\.\s*/, ''),
          suggestion: descriptionParts.join(':').trim()
        };
      });

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Fehler bei der Ideenverfeinerung' });
  }
}

