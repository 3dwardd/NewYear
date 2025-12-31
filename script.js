// Global variables
let userName = '';
let scene, camera, renderer;
let imageBoxes = [];
let textLabels = [];
let is360Active = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupNameInput();
});

// Name Input Section
function setupNameInput() {
    const submitBtn = document.getElementById('submitNameBtn');
    const nameInput = document.getElementById('userNameInput');
    
    submitBtn.addEventListener('click', handleNameSubmit);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleNameSubmit();
        }
    });
}

function handleNameSubmit() {
    const nameInput = document.getElementById('userNameInput');
    userName = nameInput.value.trim();
    
    if (userName === '') {
        alert('Please enter your name!');
        return;
    }
    
    // Create sparkle effect
    createSparkleEffect();
    
    // Hide name input section after a short delay
    setTimeout(() => {
        const nameSection = document.getElementById('nameInputSection');
        nameSection.classList.add('fade-out');
        
        setTimeout(() => {
            nameSection.classList.remove('active');
            showYearTransition();
        }, 500);
    }, 300);
}

function createSparkleEffect() {
    const btn = document.getElementById('submitNameBtn');
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            sparkle.style.left = centerX + 'px';
            sparkle.style.top = centerY + 'px';
            sparkle.style.setProperty('--tx', tx + 'px');
            sparkle.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 600);
        }, i * 30);
    }
}

// Year Transition Section
function showYearTransition() {
    const yearSection = document.getElementById('yearTransitionSection');
    const yearText = document.getElementById('yearText');
    
    yearSection.classList.add('active', 'fade-in');
    yearText.textContent = '2025';
    
    // Start transition animation after 1 second
    setTimeout(() => {
        yearText.classList.add('transitioning');
        
        setTimeout(() => {
            yearText.textContent = '2026';
            yearText.classList.remove('transitioning');
            
            // Show continue button after transition
            setTimeout(() => {
                const continueBtn = document.getElementById('continueYearBtn');
                continueBtn.style.display = 'block';
                continueBtn.addEventListener('click', () => {
                    yearSection.classList.add('fade-out');
                    setTimeout(() => {
                        yearSection.classList.remove('active');
                        show360Space();
                    }, 500);
                });
            }, 500);
        }, 1000);
    }, 1000);
}

// 360 Space Section
function show360Space() {
    const spaceSection = document.getElementById('space360Section');
    spaceSection.classList.add('active', 'fade-in');
    
    init360Environment();
    
    // Show continue button after a delay
    setTimeout(() => {
        const continueBtn = document.getElementById('continueSpaceBtn');
        continueBtn.style.display = 'block';
        continueBtn.addEventListener('click', () => {
            spaceSection.classList.add('fade-out');
            setTimeout(() => {
                cleanup360Environment();
                spaceSection.classList.remove('active');
                showFinalGreeting();
            }, 500);
        });
    }, 3000);
}

function init360Environment() {
    is360Active = true;
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create space background (stars)
    createStarField();
    
    // Create 5 image boxes arranged around the x-axis
    const images = [
        { url: 'picture1.1png', text: 'Here’s to a year that starts with fresh energy and endless possibilities' },
        { url: 'picture2.1png', text: 'May each day bring you reasons to smile and moments to feel proud of yourself.' },
        { url: 'picture3.1png', text: 'May your focus guide you through challenges and turn them into victories!' },
        { url: 'picture4.1png', text: 'May you find peace and joy through things that make you occupied' },
        { url: 'picture5.1png', text: 'And most of all, may your 2026 be full of laughter, joy, and filled with happiness!.' }
    ];
    
    const radius = 8; // Increased radius for more spacing between images
    // Arrange images in a full circle (360 degrees) with better spacing
    const angleStep = (Math.PI * 2) / images.length; // Full circle divided by number of images
    
    images.forEach((img, index) => {
        const angle = index * angleStep;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        createImageBox(x, 0, z, angle, img.url, img.text);
    });
    
    // Add controls for 360 view
    setup360Controls();
    
    // Start animation loop
    animate360();
}

function createStarField() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createImageBox(x, y, z, angle, imageUrl, textContent) {
    // Create box group
    const group = new THREE.Group();
    
    // Create screen (plane with texture) - MUCH LARGER SIZE
    const screenGeometry = new THREE.PlaneGeometry(8, 6); // Increased to 8x6 for much larger display
    const loader = new THREE.TextureLoader();
    
    loader.load(imageUrl, (texture) => {
        // Improve texture quality - prevent glitching
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        if (renderer && renderer.capabilities) {
            texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
        }
        texture.flipY = true; // Fix upside-down images
        
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.2, 0); // Adjusted Y position for larger size
        group.add(screen);
    }, undefined, (error) => {
        // Fallback if image fails to load
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.2, 0);
        group.add(screen);
    });
    
    // Create frame - LARGER to match screen
    const frameGeometry = new THREE.BoxGeometry(8.2, 6.2, 0.2);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 1.2, -0.1);
    group.add(frame);
    
    // Position the group
    group.position.set(x, y, z);
    group.lookAt(0, 0, 0);
    
    // Store text and position for HTML overlay - aligned with image center
    group.userData = { text: textContent };
    
    // Create HTML text label overlay
    const textDiv = document.createElement('div');
    textDiv.className = 'image-label';
    textDiv.textContent = textContent;
    textDiv.id = `label-${imageBoxes.length}`;
    document.getElementById('canvas-container').appendChild(textDiv);
    
    textLabels.push({ element: textDiv, group: group });
    
    scene.add(group);
    imageBoxes.push(group);
}

function setup360Controls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let currentRotationY = 0; // Track horizontal rotation (full 360 degrees)
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - previousMousePosition.x;
        
        // Full 360-degree horizontal rotation on X-axis
        const rotationSpeed = 0.005;
        currentRotationY -= deltaX * rotationSpeed;
        
        // Keep rotation within 0 to 2π for full 360 degrees
        if (currentRotationY > Math.PI * 2) currentRotationY -= Math.PI * 2;
        if (currentRotationY < 0) currentRotationY += Math.PI * 2;
        
        camera.rotation.y = currentRotationY;
        
        // Keep vertical rotation stable (no vertical movement)
        camera.rotation.x = 0;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch controls for mobile
    renderer.domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });
    
    renderer.domElement.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        
        const rotationSpeed = 0.005;
        currentRotationY -= deltaX * rotationSpeed;
        
        // Keep rotation within 0 to 2π for full 360 degrees
        if (currentRotationY > Math.PI * 2) currentRotationY -= Math.PI * 2;
        if (currentRotationY < 0) currentRotationY += Math.PI * 2;
        
        camera.rotation.y = currentRotationY;
        camera.rotation.x = 0; // Keep stable
        
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    
    renderer.domElement.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function animate360() {
    if (!is360Active) return;
    
    requestAnimationFrame(animate360);
    
    // Images stay steady - no rotation
    renderer.render(scene, camera);
    
    // Update text label positions
    updateTextLabels();
}

function updateTextLabels() {
    textLabels.forEach(({ element, group }) => {
        // Get world position of the text (centered below image)
        // Image center is at (0, 1.2, 0) in local space, text should be below it
        const textLocalPos = new THREE.Vector3(0, 1.2 - 3.5, 0); // Centered horizontally, below larger image
        const worldPos = textLocalPos.clone();
        worldPos.applyMatrix4(group.matrixWorld);
        
        // Project 3D position to 2D screen coordinates
        worldPos.project(camera);
        
        const x = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (worldPos.y * -0.5 + 0.5) * window.innerHeight;
        
        // Update label position - centered alignment
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.textAlign = 'center';
        
        // Hide if behind camera
        if (worldPos.z > 1) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    });
}

function cleanup360Environment() {
    is360Active = false;
    const container = document.getElementById('canvas-container');
    
    // Remove text labels
    textLabels.forEach(({ element }) => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
    textLabels = [];
    
    if (renderer) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
    }
    
    scene = null;
    camera = null;
    renderer = null;
    imageBoxes = [];
}

// Final Greeting Section
let fireworksAnimation = null;

function showFinalGreeting() {
    const greetingSection = document.getElementById('finalGreetingSection');
    const greetingText = document.getElementById('finalGreeting');
    
    // Ensure section is visible
    greetingSection.style.display = 'flex';
    greetingSection.classList.add('active', 'fade-in');
    
    // Set greeting text with user's name
    if (userName && userName.trim() !== '') {
        greetingText.textContent = `HAPPY NEW YEAR ${userName.toUpperCase()}!`;
    } else {
        greetingText.textContent = 'HAPPY NEW YEAR!';
    }
    
    // Make sure text is visible
    greetingText.style.display = 'block';
    greetingText.style.visibility = 'visible';
    greetingText.style.opacity = '1';
    
    // Start fireworks animation
    setTimeout(() => {
        startFireworks();
    }, 100);
}

function stopFireworks() {
    if (fireworksAnimation) {
        cancelAnimationFrame(fireworksAnimation);
        fireworksAnimation = null;
    }
}

function setupFinalImageBox() {
    const imageBox = document.getElementById('finalImageBox');
    if (!imageBox) return;
    const img = document.getElementById('finalImage');
    const placeholder = imageBox.querySelector('.image-placeholder');
    const input = document.getElementById('finalImageInput');

    imageBox.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            img.src = URL.createObjectURL(file);
            img.style.display = 'block';
            img.onload = () => URL.revokeObjectURL(img.src);
            placeholder.style.display = 'none';
        }
    });

    ['dragover', 'dragenter'].forEach(ev => {
        imageBox.addEventListener(ev, (e) => { e.preventDefault(); imageBox.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(ev => {
        imageBox.addEventListener(ev, (e) => { e.preventDefault(); imageBox.classList.remove('dragover'); });
    });

    imageBox.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            img.src = URL.createObjectURL(file);
            img.style.display = 'block';
            img.onload = () => URL.revokeObjectURL(img.src);
            placeholder.style.display = 'none';
        }
    });
}

function startFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fireworks = [];
    const particles = [];
    
    // Color palette for realistic fireworks - vibrant and diverse colors
    const fireworkColors = [
        { hue: 0, name: 'red' },        // Red
        { hue: 15, name: 'orange-red' }, // Orange-red
        { hue: 30, name: 'orange' },     // Orange
        { hue: 45, name: 'amber' },      // Amber
        { hue: 60, name: 'yellow' },     // Yellow
        { hue: 90, name: 'lime' },      // Lime
        { hue: 120, name: 'green' },     // Green
        { hue: 150, name: 'turquoise' }, // Turquoise
        { hue: 180, name: 'cyan' },      // Cyan
        { hue: 210, name: 'sky-blue' },  // Sky blue
        { hue: 240, name: 'blue' },      // Blue
        { hue: 270, name: 'purple' },    // Purple
        { hue: 300, name: 'magenta' },   // Magenta
        { hue: 330, name: 'pink' },      // Pink
        { hue: 345, name: 'rose' }       // Rose
    ];
    
    function getRandomColor() {
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        // Return the base hue - variation will be added per particle
        return color.hue;
    }
    
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
            this.speed = Math.random() * 3 + 2;
            this.hue = getRandomColor(); // Random colorful hue
            this.exploded = false;
        }
        
        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.explode();
                }
            }
        }
        
        explode() {
            this.exploded = true;
            const particleCount = 100; // More particles for richer effect
            
            // Create multi-colored explosion - each firework has multiple distinct colors
            const explosionColors = [];
            const numColors = 3 + Math.floor(Math.random() * 4); // 3-6 different colors per explosion
            
            for (let c = 0; c < numColors; c++) {
                explosionColors.push(getRandomColor());
            }
            
            for (let i = 0; i < particleCount; i++) {
                // Randomly assign one of the explosion colors to each particle
                const colorIndex = Math.floor(Math.random() * explosionColors.length);
                const particleHue = explosionColors[colorIndex] + (Math.random() * 15 - 7.5); // Slight variation
                particles.push(new Particle(this.x, this.y, particleHue));
            }
        }
        
        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.fill();
            }
        }
    }
    
    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            this.speed = Math.random() * 6 + 3;
            this.angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.gravity = 0.15;
            this.friction = 0.97;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 3 + 1.5;
        }
        
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Use bright, saturated colors with glow effect
            const alpha = this.life;
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add new firework more frequently for continuous colorful display
        if (Math.random() < 0.08) {
            fireworks.push(new Firework());
        }
        
        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            
            if (fireworks[i].exploded && particles.length === 0) {
                fireworks.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        fireworksAnimation = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

