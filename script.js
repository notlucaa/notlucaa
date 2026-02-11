// Supabase Configuration
const SUPABASE_URL = "https://jisymwnngfalpudzbunk.supabase.co";
const SUPABASE_KEY = "sb_publishable_E7WPcbF4uPR7m3AHdnBtog_Tt0TrSAW";
const supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseInstance = supabaseInstance; // Rendre accessible globalement pour React

// Scroll Progress Bar
const scrollBar = document.getElementById("scrollBar");
window.addEventListener("scroll", () => {
    if (!scrollBar) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollBar.style.width = scrollPercentage + "%";
});
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

// Helper to safely update styles
const safeStyle = (el, prop, val) => { if (el) el.style[prop] = val; };

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
    }

    if (cursorOutline) {
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards", easing: "ease-out" });
    }
});

window.addEventListener("mousedown", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(0.7)";
    cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
});

window.addEventListener("mouseup", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
});

const magneticButtons = document.querySelectorAll('.btn-primary, .explore-btn, .nav-links a, .submit-btn');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// Card Spotlight Effect
document.querySelectorAll('.card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Parallax Effect on Hero
const hero = document.querySelector('.hero-split');
const designerSide = document.querySelector('.designer-side');
const copywriterSide = document.querySelector('.copywriter-side');

if (hero && designerSide && copywriterSide) {
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        designerSide.style.backgroundPosition = `${50 + x * 0.5}% ${50 + y * 0.5}%`;
        copywriterSide.style.backgroundPosition = `${50 - x * 0.5}% ${50 - y * 0.5}%`;
    });
}

// Glitch Effect (optimized)
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const triggerGlitch = (element) => {
    if (!element) return;
    let iteration = 0;
    const originalValue = element.dataset.value || element.innerText;

    const interval = setInterval(() => {
        element.innerText = element.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) return originalValue[index];
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if (iteration >= originalValue.length) {
            clearInterval(interval);
        }
        iteration += 1 / 3;
    }, 30);
};

const setupSideGlitch = (side, textElement) => {
    if (!side || !textElement) return;

    // Set storage for the original text
    textElement.dataset.value = textElement.innerText;

    let autoGlitchInterval;

    side.addEventListener('mouseenter', () => {
        // Trigger once immediately
        triggerGlitch(textElement);
        // Then every 5 seconds
        autoGlitchInterval = setInterval(() => {
            triggerGlitch(textElement);
        }, 5000);
    });

    side.addEventListener('mouseleave', () => {
        clearInterval(autoGlitchInterval);
    });
};

if (designerSide && copywriterSide) {
    setupSideGlitch(designerSide, designerSide.querySelector('.glitch-text'));
    setupSideGlitch(copywriterSide, copywriterSide.querySelector('.glitch-text'));
}

// Add dynamic style for in-view (already handled or simplified)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(styleSheet);


// --- STARRY NIGHT BACKGROUND ---
const createStarryNight = () => {
    const container = document.querySelector('.ambient-bg');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1'; // Behind orbs
    // Blend mode to ensure stars shine through dark parts
    canvas.style.mixBlendMode = 'screen';

    // Insert before orbs (or append if you want them on top of nebula)
    // Prepending puts them BEHIND the orbs (nebula covers stars)
    if (container.firstChild) {
        container.insertBefore(canvas, container.firstChild);
    } else {
        container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    const resize = () => {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    };

    const initStars = () => {
        stars = [];
        const starCount = Math.floor((width * height) / 6000); // Lower density (lighter)
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.2, // Smaller stars
                alpha: Math.random(),
                speed: Math.random() * 0.015, // Slower twinkle
                baseAlpha: Math.random() * 0.3 + 0.1 // Fainter (0.1 to 0.4)
            });
        }
    };

    const animateStars = () => {
        if (!container.isConnected) return; // Stop if container removed

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';

        stars.forEach(star => {
            // Twinkle
            star.alpha += star.speed;
            const opacity = star.baseAlpha + Math.sin(star.alpha) * 0.15; // Softer twinkle

            ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    };

    window.addEventListener('resize', resize);
    resize();
    animateStars();
};
// Initialize Stars
document.addEventListener('DOMContentLoaded', createStarryNight);


// --- SCROLL ANIMATION OBSERVER ---


// --- SCROLL ANIMATION OBSERVER ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before fully in view
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
});


// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// Form Handling
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('success-msg');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Start Loading
        submitBtn.classList.add('loading');

        // Extract form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            // Save to Supabase (table must be named 'messages')
            const { error } = await supabaseInstance
                .from('messages')
                .insert([data]);

            if (error) {
                console.error('Supabase error details:', error);
                throw error;
            }

            // Success
            submitBtn.classList.remove('loading');
            contactForm.classList.add('hidden');
            successMsg.classList.add('visible');

        } catch (error) {
            console.error('Submission failed:', error.message || error);
            alert("Erreur : " + (error.message || "Vérifiez vos politiques RLS sur Supabase."));
            submitBtn.classList.remove('loading');
        }
    });
}

window.resetForm = function () {
    contactForm.reset();
    contactForm.classList.remove('hidden');
    successMsg.classList.remove('visible');
};


// 3D Tilt Effect on Contact Card
const contactCard = document.getElementById('contact-card');

if (contactCard) {
    contactCard.addEventListener('mousemove', (e) => {
        const rect = contactCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentages (0 to 1)
        const xPct = x / rect.width;
        const yPct = y / rect.height;

        // Calculate rotation (-10deg to 10deg)
        const xRotation = (yPct - 0.5) * 20; // Rotate around X axis based on Y position
        const yRotation = (0.5 - xPct) * 20; // Rotate around Y axis based on X position 

        contactCard.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });

    contactCard.addEventListener('mouseleave', () => {
        contactCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}



// VORTEX EFFECT (Three.js)
const runVortex = () => {
    const vortexContainer = document.getElementById('vortex-container');
    if (!vortexContainer) return;

    if (typeof THREE === 'undefined') {
        setTimeout(runVortex, 100);
        return;
    }

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup: Zoomed In for impact (Z=14)
    const camera = new THREE.PerspectiveCamera(40, vortexContainer.clientWidth / vortexContainer.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(vortexContainer.clientWidth, vortexContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.useLegacyLights = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    vortexContainer.innerHTML = '';
    vortexContainer.appendChild(renderer.domElement);

    const helixGroup = new THREE.Group();
    // Centered but larger
    helixGroup.position.x = 0;
    // Tilt slightly towards center
    helixGroup.rotation.z = 0.1;
    scene.add(helixGroup);

    // --- ASSETS ---
    const createWordTexture = (word, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = color;
        ctx.font = 'bold 50px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillText(word, 128, 64);

        return new THREE.CanvasTexture(canvas);
    };

    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2, // Slightly more metallic
        roughness: 0.1,
        transmission: 0.95,
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
        mainMaterial: true,
        side: THREE.DoubleSide
    });

    // DNA Config - RESTORED & DETAILED
    const strandRadius = 2.5;
    const strandHeight = 12;
    const itemsPerStrand = 24; // More items for density
    const turns = 1.8;

    // STRAND 1: GLASS CUBES
    const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4); // Smaller cubes
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });

    // STRAND 2: TEXT
    const words = ["DESIGN", "BROTHER", "FLOW", "IDEA", "TECH", "CODE", "COPY", "DATA", "ART"];

    // CONNECTING LINES (Rungs)
    const rungMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });

    // DETAILS: Glowing Nodes
    const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    for (let i = 0; i < itemsPerStrand; i++) {
        const t = i / (itemsPerStrand - 1);
        const angle = t * Math.PI * 2 * turns;
        const y = (t - 0.5) * strandHeight;

        // Position 1 (Cube Strand)
        const x1 = Math.cos(angle) * strandRadius;
        const z1 = Math.sin(angle) * strandRadius;

        // Position 2 (Text Strand - Phase shifted PI)
        const x2 = Math.cos(angle + Math.PI) * strandRadius;
        const z2 = Math.sin(angle + Math.PI) * strandRadius;

        // 1. Create Cube
        const cube = new THREE.Mesh(cubeGeo, glassMat);
        cube.position.set(x1, y, z1);
        cube.rotation.set(Math.random(), Math.random(), Math.random());
        cube.add(new THREE.LineSegments(edgesGeo, edgesMat));
        helixGroup.add(cube);

        // NODE 1 (Cube side only)
        const n1 = new THREE.Mesh(nodeGeo, nodeMat);
        n1.position.copy(cube.position);
        helixGroup.add(n1);

        // 2. Create Text
        const tex = createWordTexture(words[i % words.length], '#e0c3fc'); // Brighter purple
        const planeGeo = new THREE.PlaneGeometry(1.6, 0.8);
        const planeMat = new THREE.MeshBasicMaterial({
            map: tex, transparent: true, opacity: 1.0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
        });
        const label = new THREE.Mesh(planeGeo, planeMat);
        label.position.set(x2, y, z2);
        label.lookAt(0, y, 0);
        helixGroup.add(label);

        // REMOVED NODE 2 (Text side) per request

        // 3. Create Connecting Line (Rung)
        const points = [];
        points.push(new THREE.Vector3(x1, y, z1));
        points.push(new THREE.Vector3(x2, y, z2));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const rung = new THREE.Line(lineGeo, rungMat);
        helixGroup.add(rung);
    }

    // Extra: Floating Debris (Tetrahedrons)
    const debrisCount = 15;
    const debrisGeo = new THREE.TetrahedronGeometry(0.1, 0);
    const debrisMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true });
    const debrisGroup = new THREE.Group();
    helixGroup.add(debrisGroup);

    for (let i = 0; i < debrisCount; i++) {
        const d = new THREE.Mesh(debrisGeo, debrisMat);
        d.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8
        );
        d.orderBy = Math.random(); // custom property for animation
        debrisGroup.add(d);
    }

    // Extra: Floating Particles
    const particleCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        pPos[i] = (Math.random() - 0.5) * 12; // Wider spread
        // Concentrate some near center
        if (Math.random() > 0.5) pPos[i] *= 0.5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(pGeo, pMat);
    helixGroup.add(particles);


    // --- LIGHTING ---
    const cyanLight = new THREE.PointLight(0x00ffff, 2, 20);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8a2be2, 2, 20);
    violetLight.position.set(-5, -5, 5);
    scene.add(violetLight);

    // Dynamic Energy Light
    const energyLight = new THREE.PointLight(0x00f2ff, 1.5, 8);
    scene.add(energyLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    // Removed mouse interaction for pure auto-spin

    const animate = () => {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Slow, constant auto-rotation
        helixGroup.rotation.y += 0.002;

        helixGroup.position.y = Math.sin(time * 0.5) * 0.3;

        // Move Energy Light up and down
        energyLight.position.y = Math.sin(time) * 5;
        energyLight.position.z = Math.cos(time * 0.5) * 2;

        // Animate Debris
        debrisGroup.rotation.y = -time * 0.1;
        debrisGroup.children.forEach(d => {
            d.rotation.x += 0.01;
            d.rotation.y += 0.02;
            d.position.y += Math.sin(time + d.orderBy * 10) * 0.01;
        });

        particles.rotation.y = -time * 0.1;

        helixGroup.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'BoxGeometry') {
                child.rotation.x += 0.01;
                child.rotation.y += 0.01;
            }
        });

        renderer.render(scene, camera);
    };

    animate();
    const handleResize = () => {
        if (!vortexContainer) return;
        camera.aspect = vortexContainer.clientWidth / vortexContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(vortexContainer.clientWidth, vortexContainer.clientHeight);
    };
    window.addEventListener('resize', handleResize);
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', runVortex);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    runVortex();
}

/* --- PAGE TRANSITIONS --- */
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    // Check if internal link that requires transition
    if (href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        link.target !== '_blank' &&
        !e.ctrlKey && !e.metaKey) {

        e.preventDefault();
        document.body.classList.add('page-exiting');

        setTimeout(() => {
            window.location.href = href;
        }, 700); // Wait for CSS animation (0.6s)
    }
});

