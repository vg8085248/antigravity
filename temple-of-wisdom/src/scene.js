import * as THREE from 'three';
import gsap from 'gsap';
import { GuideAvatar } from './avatar.js';

let scene, camera, renderer;
let particlesSystem;
let avatar;
let mouseX = 0;
let mouseY = 0;

export function initScene(canvas) {
    // 1. Setup Core Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    // 2. Setup Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Initial position far far away for intro zoom
    camera.position.set(0, 0, 200);

    // 3. Setup Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create Galaxy Dust Particles (Default Background)
    createGalaxyBackground();

    // 5. Create Dynamic 3D Avatar (Hidden initially)
    avatar = new GuideAvatar();
    avatar.group.position.set(0, -2, 4); // Placed correctly in front of camera
    avatar.group.visible = false; // Hide until a guide is selected
    scene.add(avatar.group);

    // 6. Setup Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // 6. Handle Resize
    window.addEventListener('resize', onWindowResize);

    // 7. Start Animation Loop
    animate();
}

function createGalaxyBackground() {
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // spread particles out widely
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Custom material for glowing particles
    const material = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x88ccff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particlesSystem = new THREE.Points(geometry, material);
    scene.add(particlesSystem);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Slow continuous rotation of the cosmos
    if (particlesSystem) {
        particlesSystem.rotation.y = elapsedTime * 0.05;
        particlesSystem.rotation.x = elapsedTime * 0.02;
    }

    // Update Avatar Animations (Breathing, Looking, Lip Sync)
    if (avatar && avatar.group.visible) {
        avatar.setLookTarget(mouseX, mouseY);
        avatar.update(elapsedTime);
    }

    renderer.render(scene, camera);
}

// Update Mouse for Avatar gaze tracking
export function updateMouse(x, y) {
    mouseX = x;
    mouseY = y;
}

export function showAvatar() {
    if (avatar) {
        avatar.group.visible = true;
        // Float up animation
        gsap.fromTo(avatar.group.position,
            { y: -5 },
            { y: -1, duration: 2, ease: "power2.out" }
        );
    }
}

export function getAvatar() {
    return avatar;
}

export function playIntroZoom() {
    // Cinematic camera zoom from space into the temple
    gsap.to(camera.position, {
        z: 10,
        y: 2,
        duration: 4,
        ease: "power3.inOut"
    });
}

export function getSceneData() {
    return { scene, camera, particlesSystem, renderer };
}

export function triggerCinemaMode(isDeepWisdom) {
    if (!camera) return;

    // Slight push-in for focus on AI response
    const targetZ = isDeepWisdom ? 7 : 10;

    gsap.to(camera.position, {
        z: targetZ,
        duration: 2,
        ease: "power2.inOut"
    });
}
