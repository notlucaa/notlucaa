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

    // Wait for THREE if loaded async
    if (typeof THREE === 'undefined') {
        setTimeout(runVortex, 100);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, vortexContainer.clientWidth / vortexContainer.clientHeight, 0.1, 100);
    camera.position.z = 2; // Close view

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(vortexContainer.clientWidth, vortexContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    vortexContainer.innerHTML = ''; // Clear strict
    vortexContainer.appendChild(renderer.domElement);

    // SYNERGY TOTEM (B&F AntiGravity Representation)
    const synergyGroup = new THREE.Group();
    scene.add(synergyGroup);

    // 1. The "Design" Component (Smooth, Flowing)
    const designGeom = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
    const designMat = new THREE.MeshPhongMaterial({
        color: 0x00f2ff,
        emissive: 0x004455,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const designMesh = new THREE.Mesh(designGeom, designMat);
    designMesh.position.x = -1.5;
    synergyGroup.add(designMesh);

    // 2. The "Copywriting" Component (Sharp, Strategic)
    const copyGeom = new THREE.OctahedronGeometry(1.4, 0);
    const copyMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x222222,
        flatShading: true,
        transparent: true,
        opacity: 0.9
    });
    const copyMesh = new THREE.Mesh(copyGeom, copyMat);
    copyMesh.position.x = 1.5;
    synergyGroup.add(copyMesh);

    // 3. The "Interaction" (Connection Lines)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 8; i++) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-1.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
            new THREE.Vector3(1.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
        ]);
        const line = new THREE.Line(lineGeom, lineMat);
        synergyGroup.add(line);
    }

    // 4. Floating Particles (AntiGravity Dust)
    const dustCount = 100;
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 8;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.5 });
    const dust = new THREE.Points(dustGeom, dustMat);
    synergyGroup.add(dust);

    // Lighting
    const light1 = new THREE.PointLight(0x00f2ff, 2, 15);
    light1.position.set(2, 5, 2);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 1, 15);
    light2.position.set(-2, -5, 2);
    scene.add(light2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // 3. Background Stars (Context & Depth)
    const starsCount = 2000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
        const i3 = i * 3;
        // Spread stars far away
        const r = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        starsPos[i3] = r * Math.sin(phi) * Math.cos(theta);
        starsPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starsPos[i3 + 2] = r * Math.cos(phi);

        starsSizes[i] = Math.random() * 0.05;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('scale', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Initial Position
    synergyGroup.rotation.x = 0.2;
    synergyGroup.scale.set(0.6, 0.6, 0.6);

    // Pull camera back 
    camera.position.z = 8;

    // Mouse Interaction
    let mouseX = 0; let mouseY = 0;
    let targetX = 0; let targetY = 0;
    const windowHalfX = window.innerWidth / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation Loop
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.01;

        // Individual movement (Synergy concept)
        designMesh.rotation.y += 0.02;
        designMesh.rotation.z += 0.01;
        designMesh.position.y = Math.sin(time) * 0.2;

        copyMesh.rotation.x += 0.01;
        copyMesh.rotation.z += 0.02;
        copyMesh.position.y = Math.cos(time) * 0.2;

        // Group Parallax
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.2;
        synergyGroup.rotation.y += 0.05 * (targetX - synergyGroup.rotation.y);
        synergyGroup.rotation.x += 0.05 * (targetY - (synergyGroup.rotation.x - 0.2));

        // Floating dust
        dust.rotation.y += 0.001;

        // Background stars
        stars.rotation.y = time * 0.01;

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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

