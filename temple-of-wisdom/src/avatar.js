import * as THREE from 'three';
import gsap from 'gsap';

export class GuideAvatar {
    constructor() {
        this.group = new THREE.Group();
        this.isSpeaking = false;
        this.targetLook = new THREE.Vector3(0, 0, 5); // Default look target
        this.currentLook = new THREE.Vector3(0, 0, 5);

        // Materials (can be dynamically updated later)
        this.skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdcb3,
            roughness: 0.4,
            metalness: 0.1
        });
        this.clothesMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            roughness: 0.8,
            metalness: 0.1
        });
        const featureMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });

        // 1. Torso/Body (Cone)
        const bodyGeo = new THREE.ConeGeometry(1, 1.5, 32);
        this.body = new THREE.Mesh(bodyGeo, this.clothesMaterial);
        this.body.position.y = -0.75;
        this.group.add(this.body);

        // 2. Head Group (allows looking around)
        this.headGroup = new THREE.Group();
        this.headGroup.position.y = 0.5;
        this.group.add(this.headGroup);

        // Head Base
        const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
        this.head = new THREE.Mesh(headGeo, this.skinMaterial);
        this.headGroup.add(this.head);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
        this.leftEye = new THREE.Mesh(eyeGeo, featureMaterial);
        this.leftEye.position.set(-0.2, 0.1, 0.45);
        this.headGroup.add(this.leftEye);

        this.rightEye = new THREE.Mesh(eyeGeo, featureMaterial);
        this.rightEye.position.set(0.2, 0.1, 0.45);
        this.headGroup.add(this.rightEye);

        // Mouth (Box that scales)
        const mouthGeo = new THREE.BoxGeometry(0.2, 0.05, 0.05);
        this.mouth = new THREE.Mesh(mouthGeo, featureMaterial);
        this.mouth.position.set(0, -0.2, 0.48);
        this.headGroup.add(this.mouth);

        // --- Character Specific Accessories (Hidden by default) ---
        this.accessories = {};

        // Krishna's Crown & Feather
        this.accessories.crown = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.4, 0.4, 16),
            new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 })
        );
        this.accessories.crown.position.set(0, 0.6, 0);

        const feather = new THREE.Mesh(
            new THREE.ConeGeometry(0.1, 0.4, 8),
            new THREE.MeshStandardMaterial({ color: 0x00aaff })
        );
        feather.position.set(0.2, 0.3, 0);
        feather.rotation.z = -Math.PI / 4;
        this.accessories.crown.add(feather);
        this.headGroup.add(this.accessories.crown);

        // Shiva's Third Eye & Moon
        this.accessories.thirdEye = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x88ccff })
        );
        this.accessories.thirdEye.position.set(0, 0.3, 0.47);
        this.headGroup.add(this.accessories.thirdEye);

        this.accessories.moon = new THREE.Mesh(
            new THREE.TorusGeometry(0.15, 0.05, 16, 32, Math.PI),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        this.accessories.moon.position.set(0.3, 0.5, 0.2);
        this.accessories.moon.rotation.z = -Math.PI / 4;
        this.headGroup.add(this.accessories.moon);

        // Kalam's Glasses and Hair
        this.accessories.glasses = new THREE.Group();
        const lensGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
        const lensGeo2 = new THREE.BoxGeometry(0.3, 0.02, 0.02); // bridge
        const lensMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const leftLens = new THREE.Mesh(lensGeo, lensMat);
        const rightLens = new THREE.Mesh(lensGeo, lensMat);
        const bridge = new THREE.Mesh(lensGeo2, lensMat);
        leftLens.position.set(-0.2, 0.1, 0.5);
        rightLens.position.set(0.2, 0.1, 0.5);
        bridge.position.set(0, 0.1, 0.5);
        this.accessories.glasses.add(leftLens);
        this.accessories.glasses.add(rightLens);
        this.accessories.glasses.add(bridge);
        this.headGroup.add(this.accessories.glasses);

        const hairGeo = new THREE.BoxGeometry(1.1, 0.2, 0.8);
        this.accessories.greyHair = new THREE.Mesh(hairGeo, new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        this.accessories.greyHair.position.set(0, 0.45, -0.1);
        this.headGroup.add(this.accessories.greyHair);

        // Chanakya's Top Knot & Beard
        this.accessories.topknot = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x111111 })
        );
        this.accessories.topknot.position.set(0, 0.55, -0.3);
        this.headGroup.add(this.accessories.topknot);

        // Buddha's Ushnisha & Elongated Ears
        this.accessories.ushnisha = new THREE.Group();
        const bump1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x333333 }) // Hair texture stylized as uniform bump
        );
        bump1.position.set(0, 0.5, 0);
        this.accessories.ushnisha.add(bump1);
        this.headGroup.add(this.accessories.ushnisha);

        const earGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
        const earMat = this.skinMaterial;
        this.accessories.leftEar = new THREE.Mesh(earGeo, earMat);
        this.accessories.leftEar.position.set(-0.5, 0, 0);
        this.accessories.rightEar = new THREE.Mesh(earGeo, earMat);
        this.accessories.rightEar.position.set(0.5, 0, 0);
        this.headGroup.add(this.accessories.leftEar);
        this.headGroup.add(this.accessories.rightEar);

        // Hide all initially
        this.hideAllAccessories();

        // Base Idle Animation offsets
        this.initialMouthScale = this.mouth.scale.y;
        this.headGroupY = this.headGroup.position.y;
    }

    hideAllAccessories() {
        Object.values(this.accessories).forEach(acc => acc.visible = false);
    }

    setColors(skinColorHex, clothesColorHex) {
        gsap.to(this.skinMaterial.color, {
            r: new THREE.Color(skinColorHex).r,
            g: new THREE.Color(skinColorHex).g,
            b: new THREE.Color(skinColorHex).b,
            duration: 2
        });
        gsap.to(this.clothesMaterial.color, {
            r: new THREE.Color(clothesColorHex).r,
            g: new THREE.Color(clothesColorHex).g,
            b: new THREE.Color(clothesColorHex).b,
            duration: 2
        });
    }

    setMorph(guideId) {
        this.hideAllAccessories();
        if (guideId === 'krishna') {
            this.accessories.crown.visible = true;
        } else if (guideId === 'shiva') {
            this.accessories.thirdEye.visible = true;
            this.accessories.moon.visible = true;
        } else if (guideId === 'kalam') {
            this.accessories.glasses.visible = true;
            this.accessories.greyHair.visible = true;
        } else if (guideId === 'chanakya') {
            this.accessories.topknot.visible = true;
        } else if (guideId === 'buddha') {
            this.accessories.ushnisha.visible = true;
            this.accessories.leftEar.visible = true;
            this.accessories.rightEar.visible = true;
        }
    }

    setSpeaking(isSpeaking) {
        this.isSpeaking = isSpeaking;
        if (!isSpeaking) {
            this.mouth.scale.y = this.initialMouthScale;
        }
    }

    setLookTarget(x, y) {
        // Map normalized coordinates from screen to world relative offset
        // X goes from -1 (left) to 1 (right)
        // Y goes from 1 (top) to -1 (bottom)
        this.targetLook.set(x * 3, y * 2, 5);
    }

    update(time) {
        // 1. Breathing Idle Animation on the entire group Y
        this.group.position.y = Math.sin(time * 1.5) * 0.05;

        // 2. Look At Interpolation (Smooth head tracking)
        // Slerp towards target look position
        this.currentLook.lerp(this.targetLook, 0.05);
        // We create a dummy vector in world space for the head to look at
        const worldLookTarget = new THREE.Vector3().copy(this.headGroup.position).add(this.currentLook);
        this.headGroup.lookAt(worldLookTarget);

        // 3. Lip Sync (Mouth Animation)
        if (this.isSpeaking) {
            // Randomish jaw movement based on time
            // Sine waves stacked to simulate syllables
            const jawMovement = Math.abs(Math.sin(time * 20)) * 0.8 + Math.abs(Math.cos(time * 12)) * 0.5;
            this.mouth.scale.y = 1 + (jawMovement * 4); // Scale up to 5x initial thickness
        }
    }
}
