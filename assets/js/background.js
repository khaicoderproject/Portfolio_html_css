class ParticleBackground {
    constructor() {
        this.container = document.getElementById('bg-animation');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.particles = [];
        this.lines = [];
        this.clocks = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 250
        };
        
        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
        this.createLines();
        this.createClocks();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const numberOfParticles = (this.canvas.width * this.canvas.height) / 15000;
        for(let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 3) + 1;
            const x = (Math.random() * ((this.canvas.width - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((this.canvas.height - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 2) - 1;
            const directionY = (Math.random() * 2) - 1;
            const speed = (Math.random() * 1.5) + 0.5;
            const opacity = Math.random() * 0.7 + 0.3;
            const color = `hsl(${Math.random() * 60 + 120}, 70%, 60%)`;

            this.particles.push({
                x,
                y,
                size,
                directionX,
                directionY,
                speed,
                opacity,
                color,
                originalOpacity: opacity,
                pulseSpeed: Math.random() * 0.03 + 0.02,
                pulseDirection: 1,
                trail: [],
                maxTrailLength: Math.floor(Math.random() * 15) + 5
            });
        }
    }

    createLines() {
        const numberOfLines = 8;
        for(let i = 0; i < numberOfLines; i++) {
            this.lines.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 300 + 150,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                width: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1,
                color: `hsl(${Math.random() * 60 + 120}, 70%, 60%)`
            });
        }
    }

    createClocks() {
        const numberOfClocks = 2;
        for(let i = 0; i < numberOfClocks; i++) {
            this.clocks.push({
                x: Math.random() * (this.canvas.width - 200) + 100,
                y: Math.random() * (this.canvas.height - 200) + 100,
                radius: Math.random() * 80 + 60,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
                opacity: Math.random() * 0.3 + 0.2,
                glowSize: Math.random() * 20 + 10
            });
        }
    }

    drawClock(clock) {
        const { x, y, radius, rotation, opacity, glowSize } = clock;
        
        // Draw glow effect
        const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius + glowSize);
        glowGradient.addColorStop(0, `rgba(76, 175, 80, ${opacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
        this.ctx.fillStyle = glowGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius + glowSize, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw clock face
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Draw outer ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw hour markers
        for(let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const markerLength = i % 3 === 0 ? radius * 0.2 : radius * 0.1;
            const markerWidth = i % 3 === 0 ? 3 : 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(
                Math.cos(angle) * (radius - markerLength),
                Math.sin(angle) * (radius - markerLength)
            );
            this.ctx.lineTo(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            this.ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
            this.ctx.lineWidth = markerWidth;
            this.ctx.stroke();
        }

        // Draw hands
        const time = new Date();
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        // Hour hand
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(
            Math.cos((hours * 30 + minutes * 0.5) * Math.PI / 180) * radius * 0.5,
            Math.sin((hours * 30 + minutes * 0.5) * Math.PI / 180) * radius * 0.5
        );
        this.ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Minute hand
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(
            Math.cos(minutes * 6 * Math.PI / 180) * radius * 0.7,
            Math.sin(minutes * 6 * Math.PI / 180) * radius * 0.7
        );
        this.ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Second hand
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(
            Math.cos(seconds * 6 * Math.PI / 180) * radius * 0.8,
            Math.sin(seconds * 6 * Math.PI / 180) * radius * 0.8
        );
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Center dot
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(76, 175, 80, ${opacity})`;
        this.ctx.fill();

        this.ctx.restore();
    }

    draw() {
        // Create deep dark background with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#050505');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw dynamic lines
        this.lines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.moveTo(line.x, line.y);
            this.ctx.lineTo(
                line.x + Math.cos(line.angle) * line.length,
                line.y + Math.sin(line.angle) * line.length
            );
            this.ctx.strokeStyle = line.color;
            this.ctx.globalAlpha = line.opacity;
            this.ctx.lineWidth = line.width;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;

            // Update line position
            line.angle += line.speed;
            if(line.angle > Math.PI * 2) line.angle = 0;
        });

        // Draw and update particles
        for(let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Store trail positions
            p.trail.unshift({x: p.x, y: p.y});
            if(p.trail.length > p.maxTrailLength) p.trail.pop();

            // Draw particle trail
            for(let j = 0; j < p.trail.length; j++) {
                const pos = p.trail[j];
                const trailOpacity = (1 - j/p.trail.length) * p.opacity * 0.5;
                
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, p.size * (1 - j/p.trail.length), 0, Math.PI * 2);
                
                const glowGradient = this.ctx.createRadialGradient(
                    pos.x, pos.y, 0,
                    pos.x, pos.y, p.size * 2
                );
                glowGradient.addColorStop(0, `rgba(76, 175, 80, ${trailOpacity})`);
                glowGradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
                
                this.ctx.fillStyle = glowGradient;
                this.ctx.fill();
            }

            // Pulse effect
            p.opacity += p.pulseSpeed * p.pulseDirection;
            if(p.opacity >= p.originalOpacity + 0.4 || p.opacity <= p.originalOpacity - 0.4) {
                p.pulseDirection *= -1;
            }

            // Update position with smooth movement
            p.x += p.directionX * p.speed;
            p.y += p.directionY * p.speed;

            // Bounce off edges with energy loss
            if(p.x > this.canvas.width - p.size || p.x < p.size) {
                p.directionX = -p.directionX;
                p.speed *= 0.95;
            }
            if(p.y > this.canvas.height - p.size || p.y < p.size) {
                p.directionY = -p.directionY;
                p.speed *= 0.95;
            }

            // Enhanced mouse interaction
            if(this.mouse.x != null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    
                    p.x -= Math.cos(angle) * force * 4;
                    p.y -= Math.sin(angle) * force * 4;
                    p.opacity = Math.min(p.opacity + 0.2, 1);
                    p.speed = Math.min(p.speed + 0.1, 3);
                }
            }

            // Draw connections with dynamic opacity
            for(let j = i; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < 150) {
                    const opacity = 0.2 * (1 - distance/150);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw clocks
        this.clocks.forEach(clock => {
            this.drawClock(clock);
            clock.rotation += clock.rotationSpeed;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.lines = [];
            this.clocks = [];
            this.createParticles();
            this.createLines();
            this.createClocks();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Initialize the background when the page loads
window.addEventListener('load', () => {
    new ParticleBackground();
}); 