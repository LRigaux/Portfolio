import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function translateText(text: string, targetLang: string) {
  try {
    // Utiliser un modèle comme M2M100 ou NLLB via une API
    const { data, error } = await supabase
      .from('translations')
      .select('translated_text')
      .match({ original_text: text, target_language: targetLang })
      .single();

    if (data) return data.translated_text;

    // Si pas de traduction en cache, utiliser l'API de traduction
    // Exemple avec LibreTranslate
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'fr',
        target: targetLang
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    
    // Sauvegarder la traduction en cache
    await supabase
      .from('translations')
      .insert({
        original_text: text,
        translated_text: result.translatedText,
        target_language: targetLang
      });

    return result.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback au texte original
  }
} 