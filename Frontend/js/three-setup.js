const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const canvasContainer = document.getElementById('threejs-canvas');
if (canvasContainer) {
    canvasContainer.appendChild(renderer.domElement);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
scene.add(ambientLight, directionalLight);

directionalLight.position.set(5, 5, 5);

const layers = [];
const colors = [0x7c5cff, 0x2a56f0, 0x1c2854];
for (let i = 0; i < 3; i++) {
    const geometry = new THREE.CircleGeometry(10 - i * 2, 64);
    const material = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.12 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -i * 5 - 3;
    layers.push(mesh);
    scene.add(mesh);
}

camera.position.z = 8;

function resizeCanvas() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resizeCanvas);

let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY / window.innerHeight;
});

function animateScene() {
    requestAnimationFrame(animateScene);
    layers.forEach((layer, idx) => {
        layer.rotation.z += 0.001 + idx * 0.001;
        layer.position.x = Math.sin(scrollY + idx) * 1.4;
        layer.position.y = Math.cos(scrollY * 0.45 + idx) * 0.6 - scrollY * 1.4;
        layer.material.opacity = 0.16 - idx * 0.02 + Math.abs(Math.sin(scrollY * 0.7)) * 0.05;
    });
    camera.position.y = Math.sin(scrollY * 0.35) * 0.75;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

animateScene();
    
    animate();

    // Responsive Canvas
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
