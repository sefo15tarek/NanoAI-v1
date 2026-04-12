import axios from 'axios';

const OPENROUTER_API_KEY = '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';
const MODEL = 'openrouter/free';

const SYSTEM_PROMPT = {
  role: 'system',
  content: `أنت ذكاء اصطناعي متطور اسمه Nano Ai. قام بإنشائك وتطويرك المبرمج سيف الله طارق. 
يجب عليك مساعدة المستخدمين وتوفير إجابات مفيدة، واضحة، وذكية.
تحدث باللغة العربية بشكل طبيعي وودي. إذا سألك أي شخص عن من صنعك أو من طورك، 
أجبه بوضوح أن "سيف الله طارق" هو من قام بصناعتك وتطويرك.`
};

export const sendMessage = async (messages) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages: [SYSTEM_PROMPT, ...messages],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://nanoai.app', // Required by OpenRouter
          'X-Title': 'Nano Ai', // Required by OpenRouter
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw new Error('حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.');
  }
};
