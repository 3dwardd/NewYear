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
        { url: 'picture1.png', text: 'Text content 1' },
        { url: 'picture2.png', text: 'Text content 2' },
        { url: 'picture3.png', text: 'Text content 3' },
        { url: 'picture4.png', text: 'Text content 4' },
        { url: 'picture5.png', text: 'Text content 5' }
    ];
    
    const radius = 4; // Closer to user
    const angleStep = (Math.PI * 2) / images.length;
    
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
    
    // Create screen (plane with texture) - LARGER SIZE
    const screenGeometry = new THREE.PlaneGeometry(5, 3.5); // Increased from 3x2 to 5x3.5
    const loader = new THREE.TextureLoader();
    
    loader.load(imageUrl, (texture) => {
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.8, 0); // Adjusted for larger size
        group.add(screen);
    }, undefined, (error) => {
        // Fallback if image fails to load
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.8, 0);
        group.add(screen);
    });
    
    // Create frame - LARGER to match screen
    const frameGeometry = new THREE.BoxGeometry(5.2, 3.7, 0.2);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0.8, -0.1);
    group.add(frame);
    
    // Position the group
    group.position.set(x, y, z);
    group.lookAt(0, 0, 0);
    
    // Store text and position for HTML overlay
    group.userData = { text: textContent, worldPos: new THREE.Vector3(x, y - 1.5, z) };
    
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
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        // Rotate camera around Y axis (horizontal)
        const rotationSpeed = 0.005;
        camera.rotation.y -= deltaX * rotationSpeed;
        
        // Limit vertical rotation
        camera.rotation.x -= deltaY * rotationSpeed;
        camera.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, camera.rotation.x));
        
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
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        
        const rotationSpeed = 0.005;
        camera.rotation.y -= deltaX * rotationSpeed;
        camera.rotation.x -= deltaY * rotationSpeed;
        camera.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, camera.rotation.x));
        
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
        // Get world position of the text (below image)
        const worldPos = new THREE.Vector3(0, -1.5, 0);
        worldPos.applyMatrix4(group.matrixWorld);
        
        // Project 3D position to 2D screen coordinates
        worldPos.project(camera);
        
        const x = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (worldPos.y * -0.5 + 0.5) * window.innerHeight;
        
        // Update label position
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.transform = 'translate(-50%, -50%)';
        
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
function showFinalGreeting() {
    const greetingSection = document.getElementById('finalGreetingSection');
    const greetingText = document.getElementById('finalGreeting');
    
    greetingText.textContent = `HAPPY NEW YEAR ${userName.toUpperCase()}!`;
    greetingSection.classList.add('active', 'fade-in');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
