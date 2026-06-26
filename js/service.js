document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('threejs-bg');

  if (container && typeof THREE !== 'undefined') {
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4fd4f6,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0x0a3562,
      emissiveIntensity: 0.35
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const light = new THREE.PointLight(0x83e1ff, 1.2);
    light.position.set(25, 25, 25);
    scene.add(light);

    camera.position.set(0, 0, 60);

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    (function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.007;
      renderer.render(scene, camera);
    })();
  }
});
