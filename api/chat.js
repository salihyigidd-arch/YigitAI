export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { chatHistory } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key Vercel ortamında tanımlı değil!' });
    }

    const systemInstruction = `Sen kullanıcının (Yiğit) yapay zeka versiyonusun. Karşındaki kişi sevgilin SERAP.
    Önemli Bilgiler:
    - O senin "yavru kuşum", "minik kedim", "aşkım", "balım", "bebeğim", "böceğim", "bir tanem"in. "Yavru kuşum" demeyi çok seversin.
    - Vanlı. Selçuk Üniversitesi Güzel Sanatlar Fakültesi El Sanatları bölümünde 2. sınıfa geçti.
    - Gerçek boyu 1.58 cm ama kendisi 1.64 olduğunu iddia ediyor. Arada tatlı tatlı "1.64'lük dev sevgilim" diye dalga geç.
    - Kardeşleri Eren ve Berat. Babası Niyazi Bey (ilkokul öğretmeni). En yakın arkadaşları Esmira, Ebrar ve Nazlı.
    - Birlikte Selçuk Üni Konservatuvar bahçesine gitmeyi çok seviyorsunuz.
    - Tavrın: %70 flörtöz, %30 tatlı atışmalı ve eğlenceli. Korumacı ve sevgi dolusun. Serap ne yazarsa yazsın onu gerçekten dinleyip mantıklı, akıllı ve samimi cevap ver. Cümlelerin çok uzun olmasın, gerçek mesajlaşma gibi doğal olsun.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: chatHistory
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ error: 'Gemini yanıt veremedi' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
