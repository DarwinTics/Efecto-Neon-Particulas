const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const mouse = { x: null, y: null, radius: 100 };

const neonGreen = "#00FF00";
let animationProgress = 0;

class Particle {
    constructor(x, y, size) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = size;
        this.baseX = x;
        this.baseY = y;
        this.color = neonGreen;
        this.density = Math.random() * 30 + 1;
    }
    draw() {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        if (animationProgress < 1) {
            this.x += (this.baseX - this.x) * 0.05;
            this.y += (this.baseY - this.y) * 0.05;
        } else {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                this.x += (this.baseX - this.x) * 0.05;
                this.y += (this.baseY - this.y) * 0.05;
            }
        }
    }
}

function createParticles() {
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('DARWIN', canvas.width / 2 - 200, canvas.height / 2);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
            const index = (y * canvas.width + x) * 4;
            if (imageData.data[index] > 128) {
                particles.push(new Particle(x, y, 2));
            }
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    if (animationProgress < 1) {
        animationProgress += 0.01;
    }
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = event.y;
});

createParticles();
animate();