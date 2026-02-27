import * as THREE from 'three';
import gsap from 'gsap';
import { getAvatar } from './scene.js';

// Manages transitions between different guide environments
export function transitionEnvironment(scene, particlesSystem, guideId) {
    const config = {
        'krishna': { color: 0xffaa00, fogDepth: 0.003, size: 0.2, skin: 0x4a7cff, clothes: 0xffc107 }, // Blue skin, golden cloth
        'shiva': { color: 0x88bbff, fogDepth: 0.005, size: 0.15, skin: 0xb0c4de, clothes: 0x333333 }, // Pale blue skin, dark wrapper
        'kalam': { color: 0xffddaa, fogDepth: 0.001, size: 0.1, skin: 0x8d5524, clothes: 0x2b2b2b }, // Brown skin, dark suit
        'chanakya': { color: 0xff3333, fogDepth: 0.004, size: 0.12, skin: 0xffdcb3, clothes: 0xffffff }, // Fair skin, white robe
        'buddha': { color: 0x88ff88, fogDepth: 0.002, size: 0.15, skin: 0xffb347, clothes: 0xff8c00 }  // Golden skin, orange monk robe
    };

    const defaultConfig = { color: 0xaa55ff, fogDepth: 0.003, size: 0.1, skin: 0xdcdcdc, clothes: 0x9932cc }; // Cosmic purple/grey theme
    const targetConfig = config[guideId] || defaultConfig;

    // Transition Particles Color
    const targetColor = new THREE.Color(targetConfig.color);
    gsap.to(particlesSystem.material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 3,
        ease: "power2.inOut"
    });

    // Transition Particle Size
    gsap.to(particlesSystem.material, {
        size: targetConfig.size,
        duration: 3
    });

    // Transition Fog (Background Color mood)
    gsap.to(scene.fog, {
        density: targetConfig.fogDepth,
        duration: 3
    });

    // Update Avatar Colors and Shape
    const avatar = getAvatar();
    if (avatar) {
        avatar.setColors(targetConfig.skin, targetConfig.clothes);
        avatar.setMorph(guideId);
    }
}
