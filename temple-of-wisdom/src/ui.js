import gsap from 'gsap';
import { playIntroZoom, getSceneData, triggerCinemaMode, updateMouse, showAvatar, getAvatar } from './scene.js';
import { detectEmotion, generateResponse, guideData } from './aiEngine.js';
import { transitionEnvironment } from './environment.js';

let currentGuide = null;

export function initUI() {
    const enterBtn = document.getElementById('enter-button');
    const introScreen = document.getElementById('intro-screen');
    const mainInterface = document.getElementById('main-interface');
    const summoningUI = document.getElementById('summoning-ui');
    const interactionUI = document.getElementById('interaction-ui');
    const crystalBtns = document.querySelectorAll('.crystal-btn');

    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const responseContent = document.getElementById('response-content');
    const glassPanel = document.querySelector('.glass-panel');
    const emotionAura = document.getElementById('emotion-aura');

    // Global Mouse Tracking for Avatar Gaze
    window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        updateMouse(nx, ny);
    });

    // Browser TTS Initialization (Need to init after user gesture to unlock audio in some browsers)
    let synth = window.speechSynthesis;

    // 1. Enter the Temple
    enterBtn.addEventListener('click', () => {
        // Unlock speech synthesis on first interaction
        if (synth.state === 'suspended') synth.resume();
        const dummy = new SpeechSynthesisUtterance('');
        synth.speak(dummy);

        // Fade out intro screen
        introScreen.classList.remove('active');

        // Start cinematic camera zoom in 3D scene
        playIntroZoom();

        // Show main interface (Summoning UI)
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainInterface.classList.remove('hidden');
        }, 2000); // 2s transition matches CSS
    });

    // 2. Select a Guide
    crystalBtns.forEach(btn => {
        // Skip the custom builder button from standard crystal logic
        if (btn.id === 'custom-mentor-btn') return;

        btn.addEventListener('click', () => {
            const guideId = btn.getAttribute('data-guide');
            summoningUI.classList.remove('active'); // fade out grid
            summonGuide(guideId);
        });
    });

    // Custom Mentor Builder Logic
    const customMentorBtn = document.getElementById('custom-mentor-btn');
    const builderUI = document.getElementById('builder-ui');
    const saveCustomBtn = document.getElementById('save-custom-btn');
    const cancelCustomBtn = document.getElementById('cancel-custom-btn');
    const customNameInput = document.getElementById('custom-name');
    const customPhilosophyInput = document.getElementById('custom-philosophy');

    customMentorBtn.addEventListener('click', () => {
        builderUI.classList.remove('hidden');
    });

    cancelCustomBtn.addEventListener('click', () => {
        builderUI.classList.add('hidden');
        customNameInput.value = '';
        customPhilosophyInput.value = '';
    });

    saveCustomBtn.addEventListener('click', () => {
        const name = customNameInput.value.trim() || 'Unknown Entity';
        const philosophy = customPhilosophyInput.value.trim() || 'Silence is the answer.';
        const id = 'custom_' + Date.now();

        // Inject into ai engine mapping dynamically
        guideData[id] = {
            name: name,
            lang: 'en-IN', // Default custom character to English TTS
            greeting: `I am ${name}. My consciousness has been manifested. What do you seek?`,
            emotionResponse: () => `I perceive your emotional state.`,
            story: `My journey is defined by this core truth: ${philosophy}`,
            steps: ["Reflect on your intention.", "Align your actions with this newly awakened truth.", "Proceed with clarity."],
            philosophy: philosophy,
            quote: "Truth is subjective to the observer.",
            suvichar: "The mind shapes reality."
        };

        // Trigger Summoning sequence directly
        builderUI.classList.add('hidden');
        summoningUI.classList.remove('active'); // Ensure summoningUI is visible before hiding it with animation
        summonGuide(id);
    });

    function summonGuide(guideId) {
        currentGuide = guideId;
        console.log(`Summoning Guide: ${currentGuide}`);

        // Hide summoning UI, show interaction UI
        // Using GSAP for a smoother fade-out
        gsap.to(summoningUI, {
            opacity: 0, duration: 1, onComplete: () => {
                summoningUI.classList.add('hidden');
                summoningUI.style.opacity = 1; // Reset opacity for next time
                interactionUI.classList.remove('hidden');

                // Set initial aura color based on guide
                setAuraColor(currentGuide);

                // Show and animate floating avatar
                showAvatar();

                // Trigger initial greeting from the guide
                // A pseudo-text string that triggers the default AI greeting HTML layout
                triggerResponse(`user selected ${currentGuide} mode`, true);

                // Transition 3D scene environment
                const { scene, particlesSystem } = getSceneData();
                transitionEnvironment(scene, particlesSystem, currentGuide);
            }
        });
    }

    // 3. Handle User Chat Input
    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    function handleUserInput() {
        const text = userInput.value.trim();
        if (!text) return;

        userInput.value = '';
        triggerResponse(text, false);
    }

    // 4. Trigger AI Response Generation & Cinematic Updates
    async function triggerResponse(inputText, isInitial = false) {
        // Hide panel while thinking
        glassPanel.classList.remove('visible');

        // Simulate processing time for "thinking"
        await new Promise(resolve => setTimeout(resolve, 800));

        // Analyze emotion to change aura briefly (or persistently)
        const emotion = detectEmotion(inputText);
        updateEnvironmentBasedOnEmotion(emotion);

        // Generate structured response. It now returns {html, lang}
        const responseData = generateResponse(currentGuide, inputText, isInitial);

        // Render and show response
        responseContent.innerHTML = responseData.html;

        // Extract Plain Text for Audio Speech
        const plainText = responseData.html.replace(/<[^>]*>?/gm, ' ');
        speakResponse(currentGuide, plainText, responseData.lang);
        glassPanel.classList.add('visible');

        // Cinematic Push-in
        const isDeepWisdom = inputText.length > 20 || !!emotion; // arbitrary heuristic for demo
        triggerCinemaMode(isDeepWisdom);
    }

    // 5. Aura / Environment Management Helpers
    function setAuraColor(guideId) {
        emotionAura.className = 'aura-effect'; // reset

        const colors = {
            'krishna': 'gold',
            'shiva': 'blue',
            'kalam': 'gold',
            'chanakya': 'red',
            'buddha': 'green'
        };
        const colorClass = colors[guideId] || 'purple'; // Fallback for custom mentors
        emotionAura.classList.add(colorClass);
    }

    function updateEnvironmentBasedOnEmotion(emotionObj) {
        if (!emotionObj) return;
        // In full implementation, this hooks into Three.js lighting
        // For UI, we swap aura classes temporarily
        emotionAura.className = `aura-effect ${emotionObj.colorClass}`;
    }

    // 6. Text-to-Speech Engine
    function speakResponse(guideId, text, targetLang) {
        if (!synth) return;

        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Voice configs by Guide
        const voiceConfigs = {
            'krishna': { pitch: 1.1, rate: 0.95 },   // Calm, slightly melodic
            'shiva': { pitch: 0.6, rate: 0.85 },     // Deep, slow, resonant
            'kalam': { pitch: 1.0, rate: 1.1 },      // Energetic, slightly faster
            'chanakya': { pitch: 0.8, rate: 1.0 },   // Sharp, authoritative
            'buddha': { pitch: 0.9, rate: 0.8 }      // Extremely slow, mindful
        };

        const config = voiceConfigs[guideId] || { pitch: 1, rate: 1 };
        utterance.pitch = config.pitch;
        utterance.rate = config.rate;
        utterance.volume = 1;

        // Important: Set the explicit language tag to bias TTS pronunciation natively
        if (targetLang) {
            utterance.lang = targetLang;
        }

        // Attempt to find a suitable voice matching the specific language language (e.g. 'hi-IN')
        const voices = synth.getVoices();

        // First try to match the exact target language (like Hindi 'hi-IN')
        let selectedVoice = voices.find(v => v.lang.includes(targetLang));

        // If exact language is not found, fallback to Indian English/Generic English
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        const avatar = getAvatar();

        utterance.onstart = () => {
            if (avatar) avatar.setSpeaking(true);
        };

        utterance.onend = () => {
            if (avatar) avatar.setSpeaking(false);
        };

        utterance.onerror = () => {
            if (avatar) avatar.setSpeaking(false);
        };

        synth.speak(utterance);
    }
}
