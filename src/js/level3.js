/* ==========================================================================
   LEVEL 3 CONTROLLER: TYPEWRITER INTRO & JUMBLED JAVA CODE CHALLENGE
   ========================================================================== */

const ORIGINAL_JAVA_LINES = [
  "import java.io.*;",
  "import java.util.*;",
  "",
  "public class Main {",
  " static int n,N[][]; static List<int[]> a=new ArrayList<>();",
  "",
  " static void o(int r,int c){",
  "  int t=N[r][c];N[r][c]=N[r+1][c];N[r+1][c]=t;",
  "  t=N[r][c+1];N[r][c+1]=N[r+1][c+1];N[r+1][c+1]=t;",
  "  a.add(new int[]{r,c});",
  " }",
  " static int f(int x,int c){",
  "  for(int i=x;i<N.length;i++)if(N[i][c]==x)return i;",
  "  return 0;",
  " }",
  "",
  " public static void main(String[]z)throws Exception{",
  "  Scanner s=new Scanner(System.in);",
  "  int T=s.nextInt();",
  "  while(T-->0){",
  "   n=s.nextInt(); int m=2*n; N=new int[m+1][m+1];",
  "   int p=0;",
  "   for(int i=1;i<=m;i++)for(int j=1;j<=m;j++)N[i][j]=s.nextInt();",
  "   for(int j=1;j<=m;j++)",
  "    for(int i=1;i<=m;i++)",
  "     for(int k=i+1;k<=m;k++)p^=N[i][j]>N[k][j]?1:0;",
  "",
  "   if(p==1){System.out.println(\"-1\");continue;}",
  "",
  "   for(int x=1;x<m;x++)",
  "    for(int c=1;c<m;c+=2){",
  "     int u=f(x,c),v=f(x,c+1);",
  "     while(u>v){o(--u,c);}",
  "     while(v>u){o(--v,c);}",
  "     while(u>x)o(--u,c);",
  "    }",
  "",
  "   System.out.println(a.size());",
  "   for(int[]q:a)System.out.println(q[0]+\" \"+q[1]);",
  "   a.clear();",
  "  }",
  " }",
  "}"
];

class Level3Controller {
  constructor() {
    this.typewriterEl = document.getElementById('level3-typewriter-text');
    this.typewriterSentence = "THE THIRD GATE HAS AWAKENED...\n\nBeyond this point lies a realm of darkness, where ancient guardians protect the final treasure. Every step forward brings you closer to danger. One wrong move could destroy everything you have fought for.\n\nThe shadows are watching. The final trial awaits.\n\nARE YOU READY TO FACE YOUR DOOM?";
    this.typingInterval = null;
    this.isTyping = false;

    // State for Jumbled Java Code Challenge
    this.mainListItems = [];
    this.holdingSlotItem = null;
    this.draggedItemIndex = null;
    this.draggedFromHolding = false;
    this.isNavigatingToMap = false;

    this.initEvents();
  }

  initLevel3Intro() {
    this.isNavigatingToMap = false;
    const puzzleCard = document.getElementById('level3-puzzle-card');
    const treasureScreen = document.getElementById('treasure-screen');
    const introCard = document.querySelector('.level3-typewriter-card');
    const nextContainer = document.getElementById('level3-next-container');

    if (puzzleCard) puzzleCard.style.display = 'none';
    if (treasureScreen) treasureScreen.style.display = 'none';
    if (introCard) introCard.style.display = 'block';
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

    const nextContainer = document.getElementById('level3-next-container');
    const nextBtn = document.getElementById('level3-intro-next-btn');

    if (nextContainer) {
      nextContainer.classList.remove('revealed');
    }
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.4';
      nextBtn.style.cursor = 'not-allowed';
    }

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

        if (char === '\n') {
          this.typewriterEl.appendChild(document.createElement('br'));
        } else {
          this.typewriterEl.appendChild(document.createTextNode(char));
        }
        this.typewriterEl.appendChild(cursor);

        if (index % 2 === 0 && window.soundController) {
          window.soundController.playTypewriterTick();
        }
        index++;
      } else {
        clearInterval(this.typingInterval);
        this.typingInterval = null;
        this.isTyping = false;

        setTimeout(() => {
          if (nextContainer) nextContainer.classList.add('revealed');
          if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
          }
          if (window.soundController) window.soundController.playHoverChime(660);
        }, 300);
      }
    }, 28);
  }

  initJumbledCodePuzzle() {
    // Generate initial shuffled list
    const items = ORIGINAL_JAVA_LINES.map((text, idx) => ({
      id: `line-${idx}`,
      text: text,
      origIdx: idx
    }));

    let shuffled = [...items];
    let isSame = true;

    // Shuffle until guaranteed different from correct order
    while (isSame) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      isSame = shuffled.every((item, i) => item.text === ORIGINAL_JAVA_LINES[i]);
    }

    this.mainListItems = shuffled;
    this.holdingSlotItem = null;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autosolve') === 'true') {
      this.mainListItems = ORIGINAL_JAVA_LINES.map((text, idx) => ({
        id: `line-${idx}`,
        text: text,
        origIdx: idx
      }));
    }

    // Reset feedback and claim treasure button
    const feedbackBox = document.getElementById('level3-code-feedback-box');
    const claimContainer = document.getElementById('claim-treasure-container');
    const treasureScreen = document.getElementById('treasure-screen');

    if (feedbackBox) {
      feedbackBox.textContent = '';
      feedbackBox.className = 'feedback-box';
    }
    if (claimContainer) claimContainer.style.display = 'none';
    if (treasureScreen) treasureScreen.style.display = 'none';

    this.renderJumbledCodeUI();
  }

  renderJumbledCodeUI() {
    this.renderHoldingSlot();
    this.renderMainList();
  }

  renderHoldingSlot() {
    const slotBox = document.getElementById('holding-slot-box');
    if (!slotBox) return;

    slotBox.innerHTML = '';

    if (!this.holdingSlotItem) {
      slotBox.setAttribute('data-empty', 'true');
      const placeholder = document.createElement('span');
      placeholder.className = 'holding-slot-placeholder';
      placeholder.textContent = 'DROP CODE LINE HERE';
      slotBox.appendChild(placeholder);
    } else {
      slotBox.setAttribute('data-empty', 'false');
      const itemEl = this.createLineElement(this.holdingSlotItem, null, true);
      slotBox.appendChild(itemEl);
    }

    // Bind drop listeners to holding slot
    slotBox.ondragover = (e) => {
      e.preventDefault();
      slotBox.classList.add('drag-over');
    };
    slotBox.ondragleave = () => {
      slotBox.classList.remove('drag-over');
    };
    slotBox.ondrop = (e) => {
      e.preventDefault();
      slotBox.classList.remove('drag-over');
      this.handleDropToHoldingSlot();
    };
  }

  renderMainList() {
    const listEl = document.getElementById('jumbled-lines-list');
    const counterEl = document.getElementById('code-line-counter');
    if (!listEl) return;

    listEl.innerHTML = '';
    if (counterEl) {
      counterEl.textContent = `${this.mainListItems.length} / 43 LINES`;
    }

    this.mainListItems.forEach((item, index) => {
      const itemEl = this.createLineElement(item, index, false);
      listEl.appendChild(itemEl);
    });

    // Bind dragover/drop on main list container for reordering
    listEl.ondragover = (e) => {
      e.preventDefault();
    };
  }

  createLineElement(item, index, isHeld) {
    const div = document.createElement('div');
    div.className = 'code-line-item';
    div.draggable = true;
    div.dataset.id = item.id;
    if (index !== null) div.dataset.index = index;

    // Line handle icon
    const handle = document.createElement('span');
    handle.className = 'code-line-handle';
    handle.textContent = '⋮⋮';

    // Index badge
    const numBadge = document.createElement('span');
    numBadge.className = 'code-line-num';
    numBadge.textContent = isHeld ? 'HOLD' : `#${index + 1}`;

    // Code line text
    const textEl = document.createElement('span');
    textEl.className = 'code-line-text';
    textEl.textContent = item.text === '' ? '(empty line)' : item.text;
    if (item.text === '') {
      textEl.style.fontStyle = 'italic';
      textEl.style.opacity = '0.5';
    }

    // Quick Action buttons (Up, Down, Hold/Return)
    const controls = document.createElement('div');
    controls.className = 'code-line-controls';

    if (isHeld) {
      const returnBtn = document.createElement('button');
      returnBtn.className = 'line-ctrl-btn';
      returnBtn.title = 'Return to line list';
      returnBtn.textContent = '⎌';
      returnBtn.onclick = (e) => {
        e.stopPropagation();
        this.returnHeldItemToList();
      };
      controls.appendChild(returnBtn);
    } else {
      if (index > 0) {
        const upBtn = document.createElement('button');
        upBtn.className = 'line-ctrl-btn';
        upBtn.title = 'Move Up';
        upBtn.textContent = '▲';
        upBtn.onclick = (e) => {
          e.stopPropagation();
          this.moveItem(index, index - 1);
        };
        controls.appendChild(upBtn);
      }
      if (index < this.mainListItems.length - 1) {
        const downBtn = document.createElement('button');
        downBtn.className = 'line-ctrl-btn';
        downBtn.title = 'Move Down';
        downBtn.textContent = '▼';
        downBtn.onclick = (e) => {
          e.stopPropagation();
          this.moveItem(index, index + 1);
        };
        controls.appendChild(downBtn);
      }
      const holdBtn = document.createElement('button');
      holdBtn.className = 'line-ctrl-btn hold-btn';
      holdBtn.title = 'Move to Holding Slot';
      holdBtn.textContent = '📥';
      holdBtn.onclick = (e) => {
        e.stopPropagation();
        this.moveItemToHolding(index);
      };
      controls.appendChild(holdBtn);
    }

    div.appendChild(handle);
    div.appendChild(numBadge);
    div.appendChild(textEl);
    div.appendChild(controls);

    // Drag Events
    div.ondragstart = (e) => {
      div.classList.add('dragging');
      this.draggedItemIndex = isHeld ? 'holding' : index;
      this.draggedFromHolding = isHeld;
      e.dataTransfer.setData('text/plain', item.id);
    };

    div.ondragend = () => {
      div.classList.remove('dragging');
      this.draggedItemIndex = null;
      this.draggedFromHolding = false;
    };

    if (!isHeld) {
      div.ondragover = (e) => {
        e.preventDefault();
      };

      div.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleDropOnItem(index);
      };
    }

    return div;
  }

  moveItem(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.mainListItems.length) return;
    if (toIndex < 0 || toIndex >= this.mainListItems.length) return;

    const [moved] = this.mainListItems.splice(fromIndex, 1);
    this.mainListItems.splice(toIndex, 0, moved);

    if (window.soundController) window.soundController.playKeypadClick();
    this.renderMainList();
  }

  moveItemToHolding(index) {
    if (index < 0 || index >= this.mainListItems.length) return;

    const [item] = this.mainListItems.splice(index, 1);

    // If holding slot already contains an item, return it to the list at the same index
    if (this.holdingSlotItem) {
      this.mainListItems.splice(index, 0, this.holdingSlotItem);
    }

    this.holdingSlotItem = item;

    if (window.soundController) window.soundController.playKeypadClick();
    this.renderJumbledCodeUI();
  }

  returnHeldItemToList() {
    if (!this.holdingSlotItem) return;

    this.mainListItems.push(this.holdingSlotItem);
    this.holdingSlotItem = null;

    if (window.soundController) window.soundController.playKeypadClick();
    this.renderJumbledCodeUI();
  }

  handleDropToHoldingSlot() {
    if (this.draggedFromHolding) return;
    if (this.draggedItemIndex === null) return;

    this.moveItemToHolding(this.draggedItemIndex);
  }

  handleDropOnItem(targetIndex) {
    if (this.draggedFromHolding) {
      // Dragged from holding slot into main list at targetIndex
      if (!this.holdingSlotItem) return;
      const item = this.holdingSlotItem;
      this.holdingSlotItem = null;
      this.mainListItems.splice(targetIndex, 0, item);
      if (window.soundController) window.soundController.playKeypadClick();
      this.renderJumbledCodeUI();
    } else if (this.draggedItemIndex !== null && this.draggedItemIndex !== targetIndex) {
      // Reordered within main list
      this.moveItem(this.draggedItemIndex, targetIndex);
    }
  }

  checkCode() {
    const feedbackBox = document.getElementById('level3-code-feedback-box');
    const claimContainer = document.getElementById('claim-treasure-container');
    if (!feedbackBox) return;

    // Check if holding slot is occupied
    if (this.holdingSlotItem !== null) {
      feedbackBox.className = 'feedback-box error show';
      feedbackBox.innerHTML = `
        <div class="code-error-card">
          <h3 class="error-title">THE CODE IS STILL JUMBLED!</h3>
          <p class="error-subtitle">Every line must be in the exact correct position.</p>
        </div>
      `;
      if (claimContainer) claimContainer.style.display = 'none';
      if (window.soundController) window.soundController.playErrorSound();
      return;
    }

    // Check length
    if (this.mainListItems.length !== ORIGINAL_JAVA_LINES.length) {
      feedbackBox.className = 'feedback-box error show';
      feedbackBox.innerHTML = `
        <div class="code-error-card">
          <h3 class="error-title">THE CODE IS STILL JUMBLED!</h3>
          <p class="error-subtitle">Every line must be in the exact correct position.</p>
        </div>
      `;
      if (claimContainer) claimContainer.style.display = 'none';
      if (window.soundController) window.soundController.playErrorSound();
      return;
    }

    // Compare line by line with original source code
    let isCorrect = true;
    for (let i = 0; i < ORIGINAL_JAVA_LINES.length; i++) {
      if (this.mainListItems[i].text !== ORIGINAL_JAVA_LINES[i]) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      feedbackBox.className = 'feedback-box success show';
      feedbackBox.innerHTML = `
        <div class="code-success-card">
          <h3 class="success-title">CODE RESTORED!</h3>
          <p class="success-subtitle">THE TREASURE MAP IS UNLOCKED.</p>
        </div>
      `;
      if (claimContainer) {
        claimContainer.style.display = 'flex';
        const claimBtn = document.getElementById('claim-treasure-btn');
        if (claimBtn) {
          claimBtn.innerHTML = '<span>🗺️ CLAIM THE MAP ➔</span>';
        }
      }
      if (window.soundController) window.soundController.playSuccessChime();
      if (window.app) window.app.completeLevel3();

      // Only after program is successfully validated, display the existing map
      setTimeout(() => {
        this.openMapScreen();
      }, 600);
    } else {
      feedbackBox.className = 'feedback-box error show';
      feedbackBox.innerHTML = `
        <div class="code-error-card">
          <h3 class="error-title">THE CODE IS STILL JUMBLED!</h3>
          <p class="error-subtitle">Every line must be in the exact correct position.</p>
        </div>
      `;
      if (claimContainer) claimContainer.style.display = 'none';
      if (window.soundController) window.soundController.playErrorSound();
    }
  }

  claimTreasure() {
    this.openMapScreen();
  }

  openMapScreen() {
    if (this.isNavigatingToMap) return;
    this.isNavigatingToMap = true;
    if (window.soundController) window.soundController.playDoorOpenSound();
    const flash = document.getElementById('flash-overlay');
    if (flash) {
      flash.classList.add('active');
      setTimeout(() => {
        if (window.app) window.app.navigateTo('scene-10');
        flash.classList.remove('active');
        this.isNavigatingToMap = false;
      }, 350);
    } else {
      if (window.app) window.app.navigateTo('scene-10');
      this.isNavigatingToMap = false;
    }
  }

  autoSolve() {
    this.holdingSlotItem = null;
    this.mainListItems = ORIGINAL_JAVA_LINES.map((text, idx) => ({
      id: `line-${idx}`,
      text: text,
      origIdx: idx
    }));
    this.renderJumbledCodeUI();
  }

  initEvents() {
    // Level 3 Map Screen NEXT Button -> Scene 9 (Level 3 Intro)
    const level3MapNextBtn = document.getElementById('level3-map-next-btn');
    if (level3MapNextBtn) {
      level3MapNextBtn.addEventListener('mouseenter', () => {
        if (window.soundController) window.soundController.playHoverChime(580);
      });

      level3MapNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.soundController) window.soundController.playDoorOpenSound();

        const flash = document.getElementById('flash-overlay');
        if (flash) {
          flash.classList.add('active');
          setTimeout(() => {
            if (window.app) window.app.navigateTo('scene-9');
            flash.classList.remove('active');
          }, 800);
        } else {
          if (window.app) window.app.navigateTo('scene-9');
        }
      });
    }

    // Level 3 Completed Map Screen NEXT Button -> Scene 11 (Level 4 Page)
    const level3MapNextTo4Btn = document.getElementById('level3-map-next-btn-to-4');
    if (level3MapNextTo4Btn) {
      level3MapNextTo4Btn.addEventListener('mouseenter', () => {
        if (window.soundController) window.soundController.playHoverChime(580);
      });

      level3MapNextTo4Btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.soundController) window.soundController.playDoorOpenSound();

        const flash = document.getElementById('flash-overlay');
        if (flash) {
          flash.classList.add('active');
          setTimeout(() => {
            if (window.app) window.app.navigateTo('scene-11');
            flash.classList.remove('active');
          }, 350);
        } else {
          if (window.app) window.app.navigateTo('scene-11');
        }
      });
    }

    // Level 3 Intro NEXT Button -> Opens Jumbled Java Code Challenge
    const level3IntroNextBtn = document.getElementById('level3-intro-next-btn');
    const puzzleCard = document.getElementById('level3-puzzle-card');

    if (level3IntroNextBtn) {
      level3IntroNextBtn.addEventListener('mouseenter', () => {
        if (!this.isTyping && window.soundController) window.soundController.playHoverChime(620);
      });

      level3IntroNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.isTyping) return; // Prevent click while typing
        if (window.soundController) window.soundController.playSuccessChime();

        const introCard = document.querySelector('.level3-typewriter-card');
        const nextContainer = document.getElementById('level3-next-container');
        if (introCard) introCard.style.display = 'none';
        if (nextContainer) nextContainer.style.display = 'none';

        if (puzzleCard) {
          puzzleCard.style.display = 'block';
          this.initJumbledCodePuzzle();
          puzzleCard.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Check Code Button Listener
    const checkCodeBtn = document.getElementById('check-code-btn');
    if (checkCodeBtn) {
      checkCodeBtn.addEventListener('click', () => this.checkCode());
    }

    // Claim Treasure / Claim Map Button Listener
    const claimTreasureBtn = document.getElementById('claim-treasure-btn');
    if (claimTreasureBtn) {
      claimTreasureBtn.addEventListener('click', () => this.claimTreasure());
    }

    // Restart Game Button Listener
    const restartBtn = document.getElementById('restart-game-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playDoorOpenSound();
        if (window.app) window.app.resetGame();
      });
    }
  }
}

window.Level3Controller = Level3Controller;
