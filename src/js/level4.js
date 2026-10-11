/* ==========================================================================
   LEVEL 4 CONTROLLER: TYPEWRITER INTRO & FINAL ADVENTURE CONNECTION
   ========================================================================== */

class Level4Controller {
  constructor() {
    this.sceneEl = document.getElementById('scene-11');
    this.typewriterEl = document.getElementById('level4-typewriter-text');
    this.typewriterSentence = "Are you ready for the final adventure?";
    this.typingInterval = null;
    this.isTyping = false;

    this.initEvents();
  }

  init() {
    this.typewriterEl = document.getElementById('level4-typewriter-text');
    const destination = document.getElementById('level4-destination-screen');
    const typewriterCard = document.querySelector('.level4-typewriter-card');
    const nextContainer = document.getElementById('level4-next-container');

    if (destination) destination.style.display = 'none';
    if (typewriterCard) typewriterCard.style.display = 'flex';
    if (nextContainer) nextContainer.style.display = 'flex';

    if (!this.typewriterEl) return;
    this.startTypewriter();
  }

  startTypewriter() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }

    if (!this.typewriterEl) return;
    this.typewriterEl.innerHTML = '';

    let index = 0;
    this.isTyping = true;

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';

    this.typingInterval = setInterval(() => {
      if (index < this.typewriterSentence.length) {
        const char = this.typewriterSentence.charAt(index);
        if (cursor.parentNode === this.typewriterEl) {
          this.typewriterEl.removeChild(cursor);
        }

        this.typewriterEl.appendChild(document.createTextNode(char));
        this.typewriterEl.appendChild(cursor);

        if (index % 2 === 0 && window.soundController) {
          window.soundController.playTypewriterTick();
        }
        index++;
      } else {
        clearInterval(this.typingInterval);
        this.typingInterval = null;
        this.isTyping = false;

        if (window.soundController) {
          window.soundController.playHoverChime(660);
        }
      }
    }, 35);
  }

  onNextClicked() {
    // If typing was still active, complete it immediately
    if (this.isTyping) {
      if (this.typingInterval) clearInterval(this.typingInterval);
      this.typingInterval = null;
      this.isTyping = false;
      if (this.typewriterEl) {
        this.typewriterEl.textContent = this.typewriterSentence;
      }
    }

    if (window.soundController) window.soundController.playSuccessChime();

    // Connect to existing final adventure destination
    const destination = document.getElementById('level4-destination-screen');
    const typewriterCard = document.querySelector('.level4-typewriter-card');
    const nextContainer = document.getElementById('level4-next-container');

    if (destination) {
      if (typewriterCard) typewriterCard.style.display = 'none';
      if (nextContainer) nextContainer.style.display = 'none';
      destination.style.display = 'block';
    }
  }

  initEvents() {
    const nextBtn = document.getElementById('level4-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('mouseenter', () => {
        if (window.soundController) window.soundController.playHoverChime(620);
      });

      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.onNextClicked();
      });
    }

    const restartBtn = document.getElementById('level4-restart-game-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playDoorOpenSound();
        if (window.app) window.app.resetGame();
      });
    }
  }
}

window.Level4Controller = Level4Controller;
