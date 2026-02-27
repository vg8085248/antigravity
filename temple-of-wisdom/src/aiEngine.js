// Simulated Emotion mapping
const EMOTIONS = {
    anxiety: { keyword: ['scared', 'worried', 'nervous', 'anxious', 'fear', 'lost'], colorClass: 'blue' },
    anger: { keyword: ['angry', 'mad', 'frustrated', 'hate', 'unfair'], colorClass: 'red' },
    sadness: { keyword: ['sad', 'depressed', 'crying', 'failed', 'done', 'quitting'], colorClass: 'green' },
    confusion: { keyword: ['what', 'why', 'how', 'confused', 'dont know'], colorClass: 'purple' },
    motivation_loss: { keyword: ['give up', 'tired', 'exhausted', 'cannot do'], colorClass: 'gold' }
};

export function detectEmotion(text) {
    text = text.toLowerCase();

    // Default fallback to 'confusion' / analytical state
    let detectedObj = EMOTIONS.confusion;

    for (const [key, em] of Object.entries(EMOTIONS)) {
        if (em.keyword.some(kw => text.includes(kw))) {
            detectedObj = em;
            break;
        }
    }
    return detectedObj;
}

// -------------------------------------------------------------
// GUIDE PROFILES & RESPONSE TEMPLATES
// -------------------------------------------------------------
export const guideData = {
    'krishna': {
        name: 'Shri Krishna',
        lang: 'hi-IN', // Hindi
        greeting: "हे पार्थ… तुम्हारे हृदय में कौन सा संशय जन्म ले चुका है?",
        emotionResponse: (emotion) => `हे साधक, मैं तुम्हारे मन में ${emotion} के तूफानों को देख रहा हूँ।`,
        story: "कुरुक्षेत्र के युद्धभूमि को याद करो। जब अर्जुन मोह और शोक से पंगु हो गया था, उसने भी यही स्थिरता महसूस की थी। फिर भी, स्पष्टता पीछे हटने में नहीं है, बल्कि कर्म का धनुष उठाने में है।",
        steps: [
            "अपने मन को कर्म के फलों से अलग करो।",
            "भय से मुक्त होकर, इस सटीक क्षण में आवश्यक सर्वोच्च कर्म की पहचान करो।",
            "परिणाम की चिंता को ब्रह्मांडीय इच्छा पर छोड़ दो।"
        ],
        philosophy: "कर्म करना तुम्हारा कर्तव्य है, फल तुम्हारी चिंता नहीं। कर्म दर्शन कहता है कि स्थिर मन के साथ किया गया कार्य सभी भ्रमों को दूर करता है।",
        quote: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
        suvichar: "The mind can be a man's greatest enemy, or his greatest ally."
    },
    'shiva': {
        name: 'Lord Shiva',
        lang: 'hi-IN', // Hindi
        greeting: "शांत हो जाओ… भय तुम्हारे भीतर है, बाहर नहीं।",
        emotionResponse: (emotion) => `तुम्हारा ${emotion} अनंत चेतना की सतह पर केवल एक लहर है।`,
        story: "ब्रह्मांड भी चक्रों में जलता है और फिर से बनता है। अस्तित्व की रक्षा के लिए समुद्र के विष का पूरी तरह से सेवन किया गया था। तुम्हारी वर्तमान उथल-पुथल नटराज के भव्य नृत्य में अशांति की एक बूंद मात्र है।",
        steps: [
            "चार की गिनती तक गहराई से सांस लें, आठ की गिनती तक सांस छोड़ें।",
            "अपने डर को अपने हिस्से के रूप में नहीं, बल्कि गुजरने वाली एक बाहरी वस्तु के रूप में देखें।",
            "अहंकार के इस सीमित विश्वास को नष्ट करो कि यह क्षण अनंत काल को परिभाषित करता है।"
        ],
        philosophy: "अहंकार का विनाश ही सच्ची शांति का एकमात्र मार्ग है। तुम दर्शक हो, भावना नहीं।",
        quote: "यदा यदा हि धर्मस्य... रुको, वह कृष्ण है। शिव कहते हैं: निर्माण से पहले विनाश है। भ्रम को नष्ट करो।",
        suvichar: "Stillness is not the absence of movement, but the mastery of it."
    },
    'kalam': {
        name: 'Dr. APJ Abdul Kalam',
        lang: 'en-IN', // English
        greeting: "Welcome, young dreamer. What vision of the future brings you here?",
        emotionResponse: (emotion) => `It is perfectly normal to feel ${emotion} when you are charting an unknown trajectory.`,
        story: "When we were developing the SLV-3, we faced immense failures. The press mocked us. But my mentor taught me that a leader must absorb the failure and distribute the success. Your current struggle is just the launchpad data needed for a successful orbit.",
        steps: [
            "Write down the precise nature of the obstacle on a piece of paper today.",
            "Break down the massive goal into small, measurable daily ignition points.",
            "Seek out one piece of knowledge that solves the immediate bottleneck."
        ],
        philosophy: "Dreaming is not what you see in sleep; it is the thing that does not let you sleep. Action transforms dreams into architecture.",
        quote: "You have to dream before your dreams can come true.",
        suvichar: "Excellence is a continuous process and not an accident."
    },
    'chanakya': {
        name: 'Chanakya',
        lang: 'hi-IN', // Hindi
        greeting: "स्वागत है। भावनाओं से घिरा मन एक समृद्ध साम्राज्य की योजना नहीं बना सकता। अपनी दुविधा बताओ।",
        emotionResponse: (emotion) => `अपने ${emotion} पर नियंत्रण रखें। भावनात्मक निर्णय रणनीतिक हार का सबसे तेज़ रास्ता हैं।`,
        story: "मौर्य साम्राज्य के निर्माण के समय, हमने शुरू में भारी ताक़त पर भरोसा नहीं किया, बल्कि जासूसों की सावधानीपूर्वक नियुक्ति, गठबंधनों और दुश्मन की कमजोरियों का लाभ उठाने पर भरोसा किया। तुम्हारी स्थिति को ठंडे तर्क की आवश्यकता है, गर्म प्रतिक्रियाओं की नहीं।",
        steps: [
            "चरों का खाका तैयार करो: तुम्हारे पास क्या संसाधन हैं? तुम्हारे सहयोगी कौन हैं?",
            "भावनाओं से रहित होकर समस्या की मूल जड़ की पहचान करो।",
            "अपने इरादों की घोषणा किए बिना, पहला सामरिक कदम चुपचाप उठाओ।"
        ],
        philosophy: "एक बुद्धिमान व्यक्ति प्रहार होने से पहले ही उसकी उम्मीद कर लेता है और जवाबी कार्रवाई की तैयारी करता है। अपने दृष्टिकोण को संरचित करो।",
        quote: "शिक्षा सबसे अच्छी मित्र है। शिक्षित व्यक्ति का हर जगह सम्मान होता है।",
        suvichar: "As soon as the fear approaches near, attack and destroy it."
    },
    'buddha': {
        name: 'Gautama Buddha',
        lang: 'hi-IN', // Hindi
        greeting: "शांति तुम्हारे साथ हो। अपने मन के बोधि वृक्ष के नीचे बैठें। तुम्हारे भीतर के जल को क्या हिला रहा है?",
        emotionResponse: (emotion) => `आह, ${emotion} की भावना उत्पन्न होती है... और सभी चीजों की तरह, यह भी गुजर जाएगी।`,
        story: "एक बार एक आदमी को दुख का तीर लगा। इसे निकालने के बजाय, उसने यह जानने की मांग की कि इसे किसने मारा और तीर किस लकड़ी का बना था। अपने दर्द की उत्पत्ति का विश्लेषण करने में समय बर्बाद मत करो; तीर निकालने पर ध्यान केंद्रित करो।",
        steps: [
            "अपने ध्यान को अपने शरीर में प्रवेश करने और छोड़ने वाली सांस की अनुभूति पर लौटाओ।",
            "बिना किसी निर्णय के दर्द को स्वीकार करो। आंतरिक रूप से कहो, 'मैं तुम्हें देख रहा हूँ, पीड़ा।'",
            "चीजें बिल्कुल वैसी ही हों जैसी आप चाहते हैं, इस लगाव को छोड़ दें।"
        ],
        philosophy: "दुख (पीड़ा) लगाव से उत्पन्न होता है। मुक्ति का मार्ग दिमागीपन और जाने देना है।",
        quote: "शांति भीतर से आती है। इसे बाहर मत खोजो।",
        suvichar: "No matter how hard the past, you can always begin again."
    }
};

export function generateResponse(guideId, userText, isInitial) {
    const guide = guideData[guideId];
    if (!guide) return `<p>Guide not found.</p>`;

    // If initial greeting
    if (isInitial) {
        return `
            <div class="response-section">
                <p class="response-story" style="font-size: 1.4rem; color: var(--aura-gold);">${guide.greeting}</p>
            </div>
        `;
    }

    // Generate specific structured response based on user input
    // 1. Emotional acknowledgment
    const emotionKey = detectEmotion(userText).colorClass; // rough mapped key
    // Let's just find the first matched key name
    let emotionWord = 'conflict';
    for (const [key, val] of Object.entries(EMOTIONS)) {
        if (val.keyword.some(kw => userText.toLowerCase().includes(kw))) emotionWord = key;
    }

    const ackHTML = `<div class="response-section response-emotion">${typeof guide.emotionResponse === 'function' ? guide.emotionResponse(emotionWord) : guide.emotionResponse}</div>`;

    // 2. Personality-based story
    const storyHTML = `<div class="response-section response-story">${guide.story}</div>`;

    // 3. Actionable steps
    let stepsHTML = `<div class="response-section response-steps"><ul>`;
    if (guide.steps && guide.steps.length > 0) {
        guide.steps.forEach(step => {
            stepsHTML += `<li>${step}</li>`;
        });
    } else {
        stepsHTML += `<li>Meditate on this path.</li>`;
    }
    stepsHTML += `</ul></div>`;

    // 4. Philosophy
    const philosophyHTML = `<div class="response-section response-philosophy">${guide.philosophy}</div>`;

    // 5. Quote/Shloka & Suvichar
    const quoteHTML = `
        <div class="response-section response-quote">
            ${guide.quote}<br>
            <span style="font-size:1rem; font-family: var(--font-ui); color:var(--color-text-muted); display:block; margin-top:1rem;">"${guide.suvichar}"</span>
        </div>
    `;

    return {
        html: ackHTML + storyHTML + stepsHTML + philosophyHTML + quoteHTML,
        lang: guide.lang
    };
}
