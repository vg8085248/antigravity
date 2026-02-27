import './styles.css';
import { initScene } from './scene.js';
import { initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Scene
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        initScene(canvas);
    }

    // Initialize UI Interactions (Cinematic Intro, Summoning, Chat)
    initUI();
});
