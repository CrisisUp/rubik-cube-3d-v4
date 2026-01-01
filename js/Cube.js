import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Config } from './Config.js';

export class Cube {
    constructor(scene) {
        this.scene = scene;
        this.allCubies = [];
        this.moveHistory = [];
        this.isAnimating = false;
        this.pivot = new THREE.Object3D();
        this.group = new THREE.Group(); // Grupo para conter todos os cubies
        this.group.position.y = 0.6; // Eleva o cubo
        this.scene.add(this.pivot);
        this.scene.add(this.group);
        this._build();
    }

    _build() {
        const geom = new RoundedBoxGeometry(Config.CUBE_SIZE, Config.CUBE_SIZE, Config.CUBE_SIZE, 4, 0.1);
        
        // Materiais com cores do Config
        const materials = this._getMaterials();

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const mats = [
                        x === 1 ? materials.R : materials.base,
                        x === -1 ? materials.L : materials.base,
                        y === 1 ? materials.U : materials.base,
                        y === -1 ? materials.D : materials.base,
                        z === 1 ? materials.F : materials.base,
                        z === -1 ? materials.B : materials.base,
                    ];
                    const cubie = new THREE.Mesh(geom, mats);
                    const off = Config.CUBE_SIZE + Config.SPACING;
                    cubie.position.set(x * off, y * off, z * off);
                    this.group.add(cubie); // Adiciona ao grupo
                    this.allCubies.push(cubie);
                }
            }
        }
    }

    _getMaterials() {
        const createTex = (color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#111'; ctx.fillRect(0,0,128,128);
            ctx.fillStyle = '#' + new THREE.Color(color).getHexString();
            // Desenhando o sticker arredondado
            const p = 10, r = 16, s = 108;
            ctx.beginPath();
            ctx.roundRect(p, p, s, s, r);
            ctx.fill();
            return new THREE.CanvasTexture(canvas);
        };

        return {
            base: new THREE.MeshStandardMaterial({ color: Config.COLORS.base, roughness: 0.6 }),
            U: new THREE.MeshStandardMaterial({ map: createTex(Config.COLORS.U), roughness: 0.2 }),
            D: new THREE.MeshStandardMaterial({ map: createTex(Config.COLORS.D), roughness: 0.2 }),
            F: new THREE.MeshStandardMaterial({ map: createTex(Config.COLORS.F), roughness: 0.2 }),
            B: new THREE.MeshStandardMaterial({ map: createTex(Config.COLORS.B), roughness: 0.2 }),
            R: new THREE.MeshStandardMaterial({ map: createTex(Config.COLORS.R), roughness: 0.2 }),
            L: new THREE.MeshStandardMaterial({ map: createTex(Config.COLORS.L), roughness: 0.2 }),
        };
    }

    async rotateLayer(axis, coord, dir, duration = Config.ANIMATION_SPEED, record = true) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const activeCubies = [];
        const off = Config.CUBE_SIZE + Config.SPACING;

        // Identifica as peças da camada
        this.allCubies.forEach(c => {
            const worldPos = new THREE.Vector3();
            c.getWorldPosition(worldPos);
            if (Math.abs(Math.round(worldPos[axis] / off) - coord) < 0.1) {
                activeCubies.push(c);
            }
        });

        this.pivot.rotation.set(0,0,0);
        activeCubies.forEach(c => this.pivot.attach(c));

        return new Promise(resolve => {
            gsap.to(this.pivot.rotation, {
                [axis]: (Math.PI / 2) * dir * -1,
                duration: duration,
                ease: "power2.inOut",
                onComplete: () => {
                    this.pivot.updateMatrixWorld();
                    activeCubies.forEach(c => {
                        this.group.attach(c); // Re-anexa ao grupo
                        // Ajuste de precisão para evitar drift
                        ['x','y','z'].forEach(a => c.position[a] = Math.round(c.position[a] * 100) / 100);
                        const e = new THREE.Euler().setFromQuaternion(c.quaternion);
                        ['x','y','z'].forEach(a => e[a] = Math.round(e[a] / (Math.PI/2)) * (Math.PI/2));
                        c.quaternion.setFromEuler(e);
                    });
                    if (record) this.moveHistory.push({ axis, coord, dir });
                    this.isAnimating = false;
                    resolve();
                }
            });
        });
    }
}