import { SceneManager } from './SceneManager.js';
import { Cube } from './Cube.js';
import { Config } from './Config.js';

// 1. Inicia o motor e o cubo
const app = new SceneManager('canvas-container');
const rubiksCube = new Cube(app.scene);

// 2. Elementos da UI
const statusText = document.getElementById('status-text');
const btnSolve = document.getElementById('btn-solve');
const btnShuffle = document.getElementById('btn-shuffle');

// Mapeamento dos botões (Notation)
const MOVES = {
    'R': { axis: 'x', val: 1, dir: -1 }, "R'": { axis: 'x', val: 1, dir: 1 },
    'L': { axis: 'x', val: -1, dir: 1 }, "L'": { axis: 'x', val: -1, dir: -1 },
    'U': { axis: 'y', val: 1, dir: -1 }, "U'": { axis: 'y', val: 1, dir: 1 },
    'D': { axis: 'y', val: -1, dir: 1 }, "D'": { axis: 'y', val: -1, dir: -1 },
    'F': { axis: 'z', val: 1, dir: -1 }, "F'": { axis: 'z', val: 1, dir: 1 },
    'B': { axis: 'z', val: -1, dir: 1 }, "B'": { axis: 'z', val: -1, dir: -1 },
};

// 3. Listeners dos botões de movimento
document.querySelectorAll('.btn-move').forEach(btn => {
    btn.addEventListener('click', () => {
        const move = MOVES[btn.dataset.move];
        if (move) {
            statusText.innerText = "Girando...";
            rubiksCube.rotateLayer(move.axis, move.val, move.dir).then(() => {
                statusText.innerText = "Pronto";
                btnSolve.disabled = rubiksCube.moveHistory.length === 0;
            });
        }
    });
});

// 4. Lógica do Shuffle (Embaralhar)
btnShuffle.onclick = async () => {
    btnShuffle.disabled = true;
    btnSolve.disabled = true;
    statusText.innerText = "Embaralhando...";
    
    const moveKeys = Object.keys(MOVES);
    for (let i = 0; i < Config.SHUFFLE_MOVES; i++) {
        const randomKey = moveKeys[Math.floor(Math.random() * moveKeys.length)];
        const m = MOVES[randomKey];
        await rubiksCube.rotateLayer(m.axis, m.val, m.dir, Config.SHUFFLE_SPEED);
    }
    
    statusText.innerText = "Embaralhado!";
    btnShuffle.disabled = false;
    btnSolve.disabled = false;
};

// 5. Lógica do Solve (Resolver)
btnSolve.onclick = async () => {
    if (rubiksCube.moveHistory.length === 0) return;
    
    btnShuffle.disabled = true;
    btnSolve.disabled = true;
    statusText.innerText = "Resolvendo...";

    const history = [...rubiksCube.moveHistory].reverse();
    rubiksCube.moveHistory = []; // Limpa o histórico atual

    for (const m of history) {
        // Inverte a direção do movimento original
        await rubiksCube.rotateLayer(m.axis, m.coord, m.dir * -1, Config.ANIMATION_SPEED, false);
    }

    statusText.innerText = "Resolvido!";
    btnShuffle.disabled = false;
};

// 6. Lógica de Zoom
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');

zoomInBtn.onclick = () => {
    const target = app.camera.position.clone().multiplyScalar(0.8);
    if (target.length() > app.controls.minDistance) {
        gsap.to(app.camera.position, {
            x: target.x, y: target.y, z: target.z,
            duration: 0.5, ease: "power2.out"
        });
    }
};

zoomOutBtn.onclick = () => {
    const target = app.camera.position.clone().multiplyScalar(1.2);
    if (target.length() < app.controls.maxDistance) {
        gsap.to(app.camera.position, {
            x: target.x, y: target.y, z: target.z,
            duration: 0.5, ease: "power2.out"
        });
    }
};

// 7. Loop de renderização
app.render();