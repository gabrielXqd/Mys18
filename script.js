document.addEventListener('DOMContentLoaded', function() {
    // Configuração da data do evento
    const eventDate = new Date('2025-05-24T12:00:00').getTime();
    
    // Efeito de entrada com animação para os elementos principais
    animateOnScroll();
    
    // Efeito de parallax no scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
        }
        
        // Atualiza as animações ao rolar
        animateOnScroll();
    });
    
    // Atualização da contagem regressiva com animação
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;
        
        // Cálculo de dias, horas, minutos e segundos
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Atualização dos elementos HTML com animação
        updateCountdownElement('days', days);
        updateCountdownElement('hours', hours);
        updateCountdownElement('minutes', minutes);
        updateCountdownElement('seconds', seconds);
        
        // Se a contagem regressiva terminou
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    function updateCountdownElement(id, value) {
        const element = document.getElementById(id);
        const currentValue = element.textContent;
        const newValue = value.toString().padStart(2, '0');
        
        if (currentValue !== newValue) {
            // Adiciona classe para animação de flip
            element.classList.add('flip');
            
            // Atualiza o valor após um pequeno delay
            setTimeout(() => {
                element.textContent = newValue;
                // Remove a classe após a animação
                setTimeout(() => {
                    element.classList.remove('flip');
                }, 300);
            }, 150);
        }
    }
    
    // Inicialização da contagem regressiva
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Animações de scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adiciona efeito de destaque ao elemento alvo
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
                
                // Destaca brevemente a seção de destino
                setTimeout(() => {
                    targetElement.classList.add('highlight');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 1000);
                }, 500);
            }
        });
    });
    
    // Adiciona efeito de hover nos cards de informação
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.icon').classList.add('animated');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.icon').classList.remove('animated');
        });
    });
    
    // Função para animar elementos quando eles entram na viewport
    function animateOnScroll() {
        const elements = document.querySelectorAll('section, .info-card, .countdown-item, .btn-confirm');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Verifica se o elemento está visível na tela
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
    
    // Adiciona efeito de partículas no header (confetes)
    createParticles();
    
    function createParticles() {
        const header = document.querySelector('header');
        if (!header) return;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Posição aleatória
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const size = Math.random() * 8 + 2;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            // Cores aleatórias (vermelho e branco)
            const colors = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 255, 255, 0.7)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
            
            header.appendChild(particle);
        }
    }
});

// Adiciona estilos CSS dinamicamente para as novas animações
const styleElement = document.createElement('style');
styleElement.textContent = `
    .flip {
        animation: flipAnimation 0.5s ease-in-out;
    }
    
    @keyframes flipAnimation {
        0% { transform: perspective(400px) rotateX(0); }
        50% { transform: perspective(400px) rotateX(90deg); }
        100% { transform: perspective(400px) rotateX(0); }
    }
    
    .highlight {
        animation: highlightAnimation 1s ease-in-out;
    }
    
    @keyframes highlightAnimation {
        0% { box-shadow: 0 0 0 rgba(255, 0, 0, 0); }
        50% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.7); }
        100% { box-shadow: 0 0 0 rgba(255, 0, 0, 0); }
    }
    
    section, .info-card, .countdown-item, .btn-confirm {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    section.visible, .info-card.visible, .countdown-item.visible, .btn-confirm.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .animated {
        animation: bounce 0.5s ease infinite alternate;
    }
    
    @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
    }
    
    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-100px) rotate(360deg); }
    }
`;

document.head.appendChild(styleElement);