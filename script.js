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

    // Camera setup for DNA view
    const camera = new THREE.PerspectiveCamera(45, vortexContainer.clientWidth / vortexContainer.clientHeight, 0.1, 100);
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
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    const strandRadius = 2.5;
    const strandHeight = 9;
    const itemsPerStrand = 18;
    const turns = 1.5;

    // STRAND 1: GLASS CUBES
    const cubeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 });

    for (let i = 0; i < itemsPerStrand; i++) {
        const t = i / (itemsPerStrand - 1);
        const angle = t * Math.PI * 2 * turns;
        const y = (t - 0.5) * strandHeight;

        const x = Math.cos(angle) * strandRadius;
        const z = Math.sin(angle) * strandRadius;

        const cube = new THREE.Mesh(cubeGeo, glassMat);
        cube.position.set(x, y, z);
        cube.rotation.set(Math.random(), Math.random(), Math.random());
        cube.add(new THREE.LineSegments(edgesGeo, edgesMat));
        helixGroup.add(cube);
    }

    // STRAND 2: TEXT
    const words = ["STORY", "DATA", "TEXT", "VOICE", "BRAND", "UX", "CODE", "IDEA", "COPY"];
    for (let i = 0; i < itemsPerStrand; i++) {
        const t = i / (itemsPerStrand - 1);
        const angle = t * Math.PI * 2 * turns + Math.PI; // Phase shift
        const y = (t - 0.5) * strandHeight;

        const x = Math.cos(angle) * strandRadius;
        const z = Math.sin(angle) * strandRadius;

        const tex = createWordTexture(words[i % words.length], '#d8b4fe');
        const planeGeo = new THREE.PlaneGeometry(2.0, 1.0);
        const planeMat = new THREE.MeshBasicMaterial({
            map: tex, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
        });

        const label = new THREE.Mesh(planeGeo, planeMat);
        label.position.set(x, y, z);
        label.lookAt(0, y, 0);
        helixGroup.add(label);
    }

    // --- LIGHTING ---
    const cyanLight = new THREE.PointLight(0x00ffff, 2, 20);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8a2be2, 2, 20);
    violetLight.position.set(-5, -5, 5);
    scene.add(violetLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    let targetRotationY = 0;
    const windowHalfX = window.innerWidth / 2;

    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX - windowHalfX) * 0.001;
        targetRotationY = mouseX * 2;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        helixGroup.rotation.y += 0.003;
        helixGroup.rotation.y += 0.05 * (targetRotationY - (helixGroup.rotation.y % 1)); // Gentle nudge

        helixGroup.position.y = Math.sin(time * 0.5) * 0.3;

        helixGroup.children.forEach(child => {
            // Make cubes slowly tumble
            if (child.geometry.type === 'BoxGeometry') {
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

