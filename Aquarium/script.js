        const tank = document.getElementById('tank');
        const fishes = [];
        
        // Random number helper
        const rand = (min, max) => min + Math.random() * (max - min);

        // Fish Class
        class Fish {
            constructor() {
                this.createFish();
                this.x = rand(0, tank.clientWidth - 150);
                this.y = rand(80, tank.clientHeight - 180);
                this.speed = rand(30, 80) * (Math.random() > 0.5 ? 1 : -1);
                this.wave = rand(8, 20);
                this.freq = rand(0.5, 1.2);
                this.phase = rand(0, Math.PI * 2);
                this.time = Date.now() / 1000;
                this.dragging = false;
                this.tilt = 0;
            }

            createFish() {
                this.el = document.createElement('div');
                this.el.className = 'fish';
                this.el.innerHTML = `
                    <img src="Fish.jpg" alt="Fish">
                    <div class="fish-delete" onclick="event.stopPropagation(); this.parentElement.fish.remove()">×</div>
                `;
                this.el.fish = this;
                
                this.el.onpointerdown = (e) => {
                    if (e.target.className === 'fish-delete') return;
                    this.dragging = true;
                    this.el.setPointerCapture(e.pointerId);
                    const rect = tank.getBoundingClientRect();
                    this.offsetX = e.clientX - rect.left - this.x;
                    this.offsetY = e.clientY - rect.top - this.y;
                };

                document.onpointermove = (e) => {
                    if (!this.dragging) return;
                    const rect = tank.getBoundingClientRect();
                    this.x = Math.max(0, Math.min(e.clientX - rect.left - this.offsetX, tank.clientWidth - 150));
                    this.y = Math.max(0, Math.min(e.clientY - rect.top - this.offsetY, tank.clientHeight - 120));
                };

                document.onpointerup = () => this.dragging = false;

                tank.appendChild(this.el);
            }

            update() {
                const now = Date.now() / 1000;
                const dt = now - this.time;
                this.time = now;

                if (!this.dragging) {
                    this.x += this.speed * dt;
                    if (this.x < -40 || this.x > tank.clientWidth - 110) {
                        this.speed *= -1;
                    }
                }

                const wave = Math.sin((now * this.freq + this.phase) * Math.PI * 2) * this.wave;
                const sway = Math.sin(now * 3 + this.phase) * 2;

                this.el.style.left = this.x + 'px';
                this.el.style.top = (this.y + wave) + 'px';
                this.el.style.transform = `scaleX(${this.speed > 0 ? -1 : 1}) rotate(${sway}deg)`;
            }

            remove() {
                const idx = fishes.indexOf(this);
                if (idx > -1) fishes.splice(idx, 1);
                this.el.remove();
            }
        }

        // Create bubbles
        function createBubbles() {
            for (let i = 0; i < 14; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                const size = rand(6, 24);
                bubble.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${rand(10, 90)}%;
                    bottom: ${rand(10, 60)}px;
                    opacity: ${rand(0.2, 0.8)};
                    animation: rise ${rand(6, 12)}s linear ${-rand(0, 10)}s infinite;
                `;
                tank.appendChild(bubble);
            }
        }

        // Create plants
        function createPlants() {
            const colors = ['#0b6623', '#228b22', '#2e8b57'];
            for (let i = 0; i < 5; i++) {
                const plant = document.createElement('div');
                plant.className = 'plant';
                plant.style.cssText = `
                    height: ${rand(50, 90)}px;
                    left: ${10 + i * 18}%;
                    background: ${colors[Math.floor(rand(0, 3))]};
                `;
                tank.appendChild(plant);
            }
        }

        // Create seaweed
        function createSeaweed() {
            [5, 25, 45, 65, 85].forEach(pos => {
                const seaweed = document.createElement('div');
                seaweed.className = 'seaweed';
                seaweed.style.cssText = `
                    left: ${pos}%;
                    animation: sway ${rand(3, 5)}s ease-in-out ${-rand(0, 3)}s infinite alternate;
                `;
                for (let i = 0; i < Math.floor(rand(2, 5)); i++) {
                    const blade = document.createElement('div');
                    blade.className = 'seaweed-blade';
                    seaweed.appendChild(blade);
                }
                tank.appendChild(seaweed);
            });
        }

        // Add/Remove fish
        function addFish() {
            fishes.push(new Fish());
        }

        function removeLastFish() {
            if (fishes.length) fishes[fishes.length - 1].remove();
        }

        // Animation loop
        function animate() {
            fishes.forEach(fish => fish.update());
            requestAnimationFrame(animate);
        }

        // Initialize
        createBubbles();
        createPlants();
        createSeaweed();
        for (let i = 0; i < 5; i++) addFish();
        animate();