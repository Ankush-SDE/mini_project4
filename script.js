// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .subject-card').forEach(el => {
    observer.observe(el);
});

// Simple Log for Note Click (since they are placeholders)
document.querySelectorAll('.btn-card.notes').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#') {
            e.preventDefault();
            alert('Note resources are being updated. Check back in a few hours!');
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.padding = '1rem 10%';
        nav.style.background = 'rgba(5, 5, 16, 0.95)';
    } else {
        nav.style.padding = '1.5rem 10%';
        nav.style.background = 'rgba(5, 5, 16, 0.8)';
    }
});

// AI Chatbot Logic
const chatToggle = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('hidden');
        if(!chatBox.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    closeChat.addEventListener('click', () => {
        chatBox.classList.add('hidden');
    });

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSend = async () => {
        const text = chatInput.value.trim();
        if(text) {
            addMessage(text, 'user');
            chatInput.value = '';
            
            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    addMessage(data.reply, 'ai');
                } else {
                    addMessage("Sorry, my connection to the server dropped.", 'ai');
                }
            } catch (err) {
                addMessage("Warning: My backend server is currently offline. Please run 'node server.js' so I can think properly!", 'ai');
            }
        }
    };

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSend();
    });

    const footerAiChat = document.getElementById('footer-ai-chat');
    if (footerAiChat) {
        footerAiChat.addEventListener('click', (e) => {
            e.preventDefault();
            chatBox.classList.remove('hidden');
            chatInput.focus();
        });
    }
}

// Live Clock Logic
const liveTimeEl = document.getElementById('live-time');
const liveDateEl = document.getElementById('live-date');

if (liveTimeEl && liveDateEl) {
    const updateClock = () => {
        const now = new Date();
        liveTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        liveDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    updateClock(); // Initial call
    setInterval(updateClock, 1000); // 1-second interval
}
