/* ==========================================================================
   SCENE 3: DOOR 1, DOOR 2 & DOOR 3 QUESTION SCREENS & CONTROLLER
   ========================================================================== */

class PlaceholderController {
  constructor() {
    this.sceneEl = document.getElementById('scene-3');
    this.containerEl = document.getElementById('trial-container');
    this.currentDoorId = 'door1';
    
    // Door 1 & Door 2 Answer State
    this.currentAnswer = '';

    this.initKeyboardEvents();
  }

  updateView(doorId) {
    this.currentDoorId = doorId;
    this.currentAnswer = '';

    if (this.sceneEl) {
      this.sceneEl.setAttribute('data-active-door', doorId);
    }

    if (doorId === 'door1') {
      this.renderDoor1QuestionScreen();
    } else if (doorId === 'door2') {
      this.renderDoor2QuestionScreen();
    } else if (doorId === 'door3') {
      this.renderDoor3QuestionScreen();
    }
  }

  renderQuestionTabs(currentDoorId) {
    const isDoor2Unlocked = window.app ? window.app.isDoorUnlocked('door2') : false;
    const isDoor3Unlocked = window.app ? window.app.isDoorUnlocked('door3') : false;
    const isDoor1Completed = window.app ? window.app.isDoorCompleted('door1') : false;
    const isDoor2Completed = window.app ? window.app.isDoorCompleted('door2') : false;
    const isDoor3Completed = window.app ? window.app.isDoorCompleted('door3') : false;

    return `
      <div class="level1-question-tabs-nav">
        <button class="q-tab-btn ${currentDoorId === 'door1' ? 'active' : ''} ${isDoor1Completed ? 'completed' : ''}" data-target-door="door1">
          <span class="q-tab-num">QUESTION 1</span>
          <span class="q-tab-name">Reservoir Sampling ${isDoor1Completed ? '✓' : ''}</span>
        </button>
        <button class="q-tab-btn ${currentDoorId === 'door2' ? 'active' : ''} ${!isDoor2Unlocked ? 'disabled' : ''} ${isDoor2Completed ? 'completed' : ''}" data-target-door="door2" ${!isDoor2Unlocked ? 'disabled' : ''}>
          <span class="q-tab-num">QUESTION 2</span>
          <span class="q-tab-name">Chessboard Dominoes ${!isDoor2Unlocked ? '🔒' : isDoor2Completed ? '✓' : ''}</span>
        </button>
        <button class="q-tab-btn ${currentDoorId === 'door3' ? 'active' : ''} ${!isDoor3Unlocked ? 'disabled' : ''} ${isDoor3Completed ? 'completed' : ''}" data-target-door="door3" ${!isDoor3Unlocked ? 'disabled' : ''}>
          <span class="q-tab-num">QUESTION 3</span>
          <span class="q-tab-name">Min Comparisons ${!isDoor3Unlocked ? '🔒' : isDoor3Completed ? '✓' : ''}</span>
        </button>
      </div>
    `;
  }

  bindQuestionTabEvents() {
    const tabBtns = document.querySelectorAll('.q-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const door = btn.dataset.targetDoor;
        if (!door || btn.disabled || btn.classList.contains('disabled')) return;
        if (window.soundController) window.soundController.playHoverChime(500);
        if (window.app) {
          window.app.setSelectedDoor(door);
        }
      });
    });
  }

  /* ==========================================================================
     DOOR 1: RESERVOIR SAMPLING QUESTION SCREEN
     ========================================================================== */
  renderDoor1QuestionScreen() {
    if (!this.containerEl) return;

    const isDoor2Unlocked = window.app ? window.app.isDoorUnlocked('door2') : false;

    this.containerEl.innerHTML = `
      <div class="trial-wrapper">
        ${this.renderQuestionTabs('door1')}

        <div class="trial-header-bar">
          <div class="trial-header-title">
            <span>🔥</span>
            <span>DOOR 1: THE CRIMSON RUNES</span>
          </div>
          <div class="door-tag">TRIAL 01</div>
        </div>

        <div class="door1-layout-grid">
          
          <!-- LEFT SIDE: QUESTION PANEL -->
          <div class="question-panel">
            <span class="puzzle-title-tag">Question 1</span>
            <h2 class="puzzle-main-title">Stream Sampling Algorithm</h2>
            
            <div class="puzzle-body-text">
              A stream of integers arrives one number at a time. You do not know how many numbers the stream will contain.
              <br><br>
              You are allowed to store <strong>only one number</strong> at any time.
              <br><br>
              Design an algorithm that selects exactly one number from the stream such that, after processing <code>n</code> numbers, <strong>every number has an equal probability of <code>1/n</code> of being selected</strong>.
            </div>

            <div class="puzzle-task-box">
              <div class="task-label">TASK QUESTION:</div>
              <div class="task-text">What is the name of this algorithm?</div>
            </div>
          </div>

          <!-- RIGHT SIDE: ANSWER ENTRY INTERFACE -->
          <div class="door1-keypad-panel">
            <div class="keypad-header-label">ENTER ANSWER</div>
            
            <!-- Answer Box Input -->
            <div class="answer-box-container">
              <input type="text" id="answer-box-input" class="answer-box" placeholder="Enter your answer" spellcheck="false" autocomplete="off" />
            </div>

            <!-- Submit Answer Button -->
            <button class="submit-btn clickable" id="submit-answer-btn">SUBMIT ANSWER</button>

            <!-- Feedback Display Box -->
            <div class="feedback-box" id="feedback-box"></div>

            <!-- Action Navigation Buttons -->
            <div class="action-buttons-group">
              <button class="proceed-btn clickable ${isDoor2Unlocked ? 'active' : ''}" id="proceed-door2-btn">
                <span>PROCEED TO DOOR 2 →</span>
              </button>
              <button class="back-btn clickable" id="back-level1-btn">
                <span>← RETURN TO LEVEL 1</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }

    this.bindDoor1Events();
  }

  bindDoor1Events() {
    const answerInput = document.getElementById('answer-box-input');
    const feedbackBox = document.getElementById('feedback-box');
    const submitBtn = document.getElementById('submit-answer-btn');
    const proceedBtn = document.getElementById('proceed-door2-btn');
    const backBtn = document.getElementById('back-level1-btn');

    if (answerInput) {
      answerInput.focus();
      answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      });
    }

    const handleSubmit = () => {
      if (!feedbackBox || !answerInput) return;

      const rawVal = answerInput.value.trim();

      if (rawVal === '') {
        feedbackBox.textContent = 'Enter your answer first!';
        feedbackBox.className = 'feedback-box warning show';
        answerInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        return;
      }

      const normalized = rawVal.toLowerCase().replace(/\s+/g, ' ');

      if (normalized === 'reservoir sampling' || normalized === 'reservoirsampling') {
        feedbackBox.textContent = 'Correct! Reservoir Sampling guarantees equal 1/n probability for every number. Door 2 is unlocked!';
        feedbackBox.className = 'feedback-box success show';
        answerInput.classList.remove('error-border');
        answerInput.classList.add('success-border');

        if (window.soundController) window.soundController.playSuccessChime();
        if (window.app) window.app.unlockDoor('door2');

        if (proceedBtn) proceedBtn.classList.add('active');

        setTimeout(() => {
          if (this.currentDoorId === 'door1' && window.app) {
            window.app.setSelectedDoor('door2');
            window.app.navigateTo('scene-3');
          }
        }, 1500);
      } else {
        feedbackBox.textContent = 'Incorrect! Think of the algorithm that maintains equal 1/n probability for a stream.';
        feedbackBox.className = 'feedback-box error show';
        answerInput.classList.add('error-border');
        
        const panel = document.querySelector('.door1-keypad-panel');
        if (panel) {
          panel.classList.add('shake');
          setTimeout(() => panel.classList.remove('shake'), 500);
        }

        if (window.app) window.app.deductLife();
      }
    };

    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playDoorOpenSound();
        if (window.app) {
          window.app.setSelectedDoor('door2');
          window.app.navigateTo('scene-3');
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playHoverChime(400);
        if (window.app) window.app.navigateTo('scene-2');
      });
    }

    this.bindQuestionTabEvents();
  }

  /* ==========================================================================
     DOOR 2: 8x8 CHESSBOARD DOMINO TILING QUESTION SCREEN
     ========================================================================== */
  renderDoor2QuestionScreen() {
    if (!this.containerEl) return;

    const isDoor3Unlocked = window.app ? window.app.isDoorUnlocked('door3') : false;

    this.containerEl.innerHTML = `
      <div class="trial-wrapper door2-vertical-wrapper">
        ${this.renderQuestionTabs('door2')}
        
        <!-- Header Bar -->
        <div class="trial-header-bar gold-theme" style="width: 100%;">
          <div class="trial-header-title">
            <span>🗝️</span>
            <span>DOOR 2: THE CHESSBOARD DOMINOES</span>
          </div>
          <div class="door-tag" style="color: #ffd24c; border-color: #ffd24c;">TRIAL 02</div>
        </div>

        <!-- TOP QUESTION PANEL -->
        <div class="question-panel gold-theme">
          <span class="puzzle-title-tag">Question 2</span>
          <h2 class="puzzle-main-title">8 × 8 Chessboard Domino Tiling</h2>
          
          <div class="puzzle-body-text">
            Consider a standard 8 × 8 chessboard.
            <br><br>
            Remove the <strong>two opposite corner squares</strong> from the board.
            <br><br>
            You now have <strong>62 squares remaining</strong>.
            <br><br>
            You are given <strong>31 identical dominoes</strong>, and each domino covers exactly <strong>two horizontally or vertically adjacent squares</strong>.
            <br><br>
            Determine whether it is possible to cover all 62 remaining squares using all 31 dominoes <strong>without overlapping or leaving any square uncovered</strong>.
            <br><br>
            You must give a <strong>mathematical proof</strong> for your answer. Do not use brute force.
          </div>

          <div class="puzzle-task-box">
            <div class="task-label">TASK QUESTION:</div>
            <div class="task-text">Is it possible to cover all 62 remaining squares? Provide your conclusion and mathematical proof below.</div>
          </div>
        </div>

        <!-- 1. CONCLUSION INPUT BOX -->
        <div class="door3-input-group" style="width: 100%;">
          <label class="door3-input-label" for="door2-conclusion-input">Your Conclusion:</label>
          <input type="text" id="door2-conclusion-input" class="answer-box" placeholder="e.g. Impossible" spellcheck="false" autocomplete="off" />
        </div>

        <!-- 2. MATHEMATICAL PROOF TEXTAREA -->
        <div class="door3-input-group" style="width: 100%;">
          <label class="door3-input-label" for="door2-proof-input">Mathematical Proof / Reasoning:</label>
          <textarea id="door2-proof-input" class="code-editor-textarea" style="height: 100px;" spellcheck="false" placeholder="Provide your mathematical proof explaining the chessboard coloring argument..."></textarea>
        </div>

        <!-- 3. SUBMIT ANSWER BUTTON -->
        <button class="submit-btn clickable" id="submit-answer-btn">SUBMIT ANSWER</button>
        
        <!-- Feedback Box -->
        <div class="feedback-box" id="feedback-box"></div>

        <!-- Action Navigation Buttons -->
        <div class="action-buttons-group">
          <button class="proceed-btn clickable ${isDoor3Unlocked ? 'active' : ''}" id="proceed-door3-btn">
            <span>PROCEED TO DOOR 3 →</span>
          </button>
          <button class="back-btn clickable" id="back-level1-btn">
            <span>← RETURN TO LEVEL 1</span>
          </button>
        </div>

      </div>
    `;

    this.bindDoor2Events();
  }

  bindDoor2Events() {
    const conclusionInput = document.getElementById('door2-conclusion-input');
    const proofInput = document.getElementById('door2-proof-input');
    const feedbackBox = document.getElementById('feedback-box');
    const submitBtn = document.getElementById('submit-answer-btn');
    const proceedBtn = document.getElementById('proceed-door3-btn');
    const backBtn = document.getElementById('back-level1-btn');

    if (conclusionInput) {
      conclusionInput.focus();
    }

    const handleSubmit = () => {
      if (!feedbackBox || !conclusionInput || !proofInput) return;

      const conclusionVal = conclusionInput.value.trim().toLowerCase();
      const proofVal = proofInput.value.trim().toLowerCase();

      conclusionInput.classList.remove('error-border', 'success-border');
      proofInput.classList.remove('error-border', 'success-border');

      if (conclusionVal === '' || proofVal === '') {
        feedbackBox.textContent = 'Both conclusion (e.g. Impossible) and mathematical proof are required!';
        feedbackBox.className = 'feedback-box warning show';
        if (conclusionVal === '') conclusionInput.classList.add('error-border');
        if (proofVal === '') proofInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        return;
      }

      const isConclusionCorrect = conclusionVal.includes('impossible') || conclusionVal === 'not possible' || conclusionVal === 'no';

      const hasMathematicalProof = proofVal.length >= 10 && (
        proofVal.includes('color') || proofVal.includes('black') || proofVal.includes('white') ||
        proofVal.includes('30') || proofVal.includes('32') || proofVal.includes('corner') ||
        proofVal.includes('domino') || proofVal.includes('opposite') || proofVal.includes('parity')
      );

      if (isConclusionCorrect && hasMathematicalProof) {
        feedbackBox.textContent = 'Correct! Tiling is IMPOSSIBLE because opposite corners have the same color (leaving 30 of one color & 32 of another), while 31 dominoes require 31 of each color. Door 3 is unlocked!';
        feedbackBox.className = 'feedback-box success show';
        conclusionInput.classList.add('success-border');
        proofInput.classList.add('success-border');

        if (window.soundController) window.soundController.playSuccessChime();
        if (window.app) window.app.unlockDoor('door3');

        if (proceedBtn) proceedBtn.classList.add('active');

        setTimeout(() => {
          if (this.currentDoorId === 'door2' && window.app) {
            window.app.setSelectedDoor('door3');
            window.app.navigateTo('scene-3');
          }
        }, 1500);
      } else {
        feedbackBox.textContent = 'Incorrect! Your conclusion must state IMPOSSIBLE and include the mathematical proof using the chessboard coloring argument (30 vs 32 squares).';
        feedbackBox.className = 'feedback-box error show';
        
        if (!isConclusionCorrect) conclusionInput.classList.add('error-border');
        if (!hasMathematicalProof) proofInput.classList.add('error-border');

        const panel = document.querySelector('.door2-vertical-wrapper');
        if (panel) {
          panel.classList.add('shake');
          setTimeout(() => panel.classList.remove('shake'), 500);
        }

        if (window.app) window.app.deductLife();
      }
    };

    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playDoorOpenSound();
        if (window.app) {
          window.app.setSelectedDoor('door3');
          window.app.navigateTo('scene-3');
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playHoverChime(400);
        if (window.app) window.app.navigateTo('scene-2');
      });
    }

    this.bindQuestionTabEvents();
  }

  /* ==========================================================================
     DOOR 3: MINIMUM COMPARISONS (1,000 NUMBERS) QUESTION SCREEN
     ========================================================================== */
  renderDoor3QuestionScreen() {
    if (!this.containerEl) return;

    this.containerEl.innerHTML = `
      <div class="trial-wrapper door2-vertical-wrapper" style="max-width: 1050px;">
        ${this.renderQuestionTabs('door3')}
        <div class="trial-header-bar azure-theme" style="width: 100%;">
          <div class="trial-header-title">
            <span>⚡</span>
            <span>DOOR 3: MINIMUM COMPARISONS</span>
          </div>
          <div class="door-tag" style="color: #5ce1e6; border-color: #5ce1e6;">TRIAL 03</div>
        </div>

        <div class="door3-code-layout-grid">
          
          <!-- LEFT SIDE: QUESTION STATEMENT & CONSTRAINTS -->
          <div class="question-panel azure-theme">
            <span class="puzzle-title-tag">Question 3</span>
            <h2 class="puzzle-main-title">Largest & Second-Largest Number</h2>
            
            <div class="puzzle-body-text">
              You are given 1,000 distinct unsorted numbers.
              <br><br>
              You can compare two numbers at a time to determine which one is larger.
              <br><br>
              Find both:
              <ul class="puzzle-list">
                <li>The <strong>largest number</strong></li>
                <li>The <strong>second-largest number</strong></li>
              </ul>
              <br>
              Your solution must use the <strong>minimum possible number of comparisons in the worst case</strong>.
              <br><br>
              You are not allowed to sort the numbers.
            </div>

            <div class="puzzle-task-box">
              <div class="task-label">QUESTIONS TO ANSWER:</div>
              <div class="task-text" style="font-size: 0.88rem; font-weight: 500;">
                1. What is the minimum number of comparisons required?<br>
                2. Describe an algorithm that achieves this minimum.<br>
                3. Explain why fewer comparisons are impossible.
              </div>
            </div>
          </div>

          <!-- RIGHT SIDE: THREE REQUIRED INPUTS (n input + code/algorithm editor + output input) -->
          <div class="door3-code-editor-panel">
            
            <!-- 1. N VALUE / TOTAL NUMBERS INPUT -->
            <div class="door3-input-group">
              <label class="door3-input-label" for="n-input">Number of items (N):</label>
              <div class="door3-inline-input-row">
                <span>N =</span>
                <input type="number" id="n-input" class="door3-single-input" placeholder="Value of N (1000)" value="1000">
              </div>
            </div>

            <!-- 2. CODE & ALGORITHM EDITOR BOX -->
            <div class="door3-input-group" style="flex: 1;">
              <label class="door3-input-label" for="code-input">Algorithm solution & proof explanation:</label>
              <textarea id="code-input" class="code-editor-textarea" spellcheck="false" placeholder="// 1. Describe tournament tree algorithm...\n// 2. Explain why 1008 (999 + 9) comparisons are required..."></textarea>
            </div>

            <!-- 3. OUTPUT / MINIMUM COMPARISONS INPUT -->
            <div class="door3-input-group">
              <label class="door3-input-label" for="output-input">Minimum comparisons required:</label>
              <div class="door3-inline-input-row">
                <span>Comparisons =</span>
                <input type="number" id="output-input" class="door3-single-input" placeholder="e.g. 1008">
              </div>
            </div>

            <!-- SUBMIT ANSWER BUTTON -->
            <button class="submit-btn azure-btn clickable" id="submit-answer-btn" style="margin-top: 6px;">SUBMIT ANSWER</button>

            <!-- Feedback Display Box -->
            <div class="feedback-box" id="feedback-box"></div>

            <!-- Action Navigation Buttons -->
            <div class="action-buttons-group">
              <button class="proceed-btn clickable" id="claim-map-btn">
                <span>🗺️ CLAIM THE MAP & CONTINUE</span>
              </button>
              <button class="back-btn clickable" id="back-level1-btn">
                <span>← RETURN TO LEVEL 1</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    `;

    this.bindDoor3Events();
  }

  bindDoor3Events() {
    const nInput = document.getElementById('n-input');
    const codeInput = document.getElementById('code-input');
    const outputInput = document.getElementById('output-input');
    const feedbackBox = document.getElementById('feedback-box');
    const submitBtn = document.getElementById('submit-answer-btn');
    const claimMapBtn = document.getElementById('claim-map-btn');
    const backBtn = document.getElementById('back-level1-btn');

    if (!submitBtn) return;

    const handleSubmit = () => {
      if (!feedbackBox || !nInput || !codeInput || !outputInput) return;

      const nValStr = nInput.value.trim();
      const rawCode = codeInput.value.trim();
      const outputValStr = outputInput.value.trim();

      // Reset border styles
      nInput.classList.remove('error-border', 'success-border');
      codeInput.classList.remove('error-border', 'success-border');
      outputInput.classList.remove('error-border', 'success-border');

      // Check missing inputs
      if (nValStr === '' || rawCode === '' || outputValStr === '') {
        feedbackBox.textContent = 'All 3 inputs (N value, algorithm explanation/code, and comparisons answer) are required!';
        feedbackBox.className = 'feedback-box warning show';
        if (nValStr === '') nInput.classList.add('error-border');
        if (rawCode === '') codeInput.classList.add('error-border');
        if (outputValStr === '') outputInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        return;
      }

      // 1. Validate N value (1000 or 1008 accepted for N)
      const nVal = parseInt(nValStr, 10);
      if (isNaN(nVal) || (nVal !== 1000 && nVal !== 1008)) {
        feedbackBox.textContent = 'Incorrect N value! N should equal 1000 for 1,000 distinct numbers.';
        feedbackBox.className = 'feedback-box error show';
        nInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        if (window.app) window.app.deductLife();
        return;
      }

      // 2. Validate Code constraints
      const hasSorting = /\.sort\b|sort\(|Arrays\.sort|sorted\(/i.test(rawCode);
      if (hasSorting) {
        feedbackBox.textContent = 'Constraint Violation: Sorting is NOT allowed! Must use optimal comparison algorithm.';
        feedbackBox.className = 'feedback-box error show';
        codeInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        if (window.app) window.app.deductLife();
        return;
      }

      const lowerCode = rawCode.toLowerCase();
      const hasAlgorithmExplanation = lowerCode.length >= 10 && (
        lowerCode.includes('tournament') || lowerCode.includes('tree') || lowerCode.includes('compare') ||
        lowerCode.includes('999') || lowerCode.includes('9') || lowerCode.includes('1008') ||
        lowerCode.includes('log') || lowerCode.includes('knockout') || lowerCode.includes('winner') ||
        lowerCode.includes('second') || lowerCode.includes('largest') || lowerCode.includes('min')
      );

      if (!hasAlgorithmExplanation) {
        feedbackBox.textContent = 'Please describe the tournament tree algorithm and explain why 1008 comparisons are required.';
        feedbackBox.className = 'feedback-box error show';
        codeInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        if (window.app) window.app.deductLife();
        return;
      }

      // 3. Validate Output minimum comparisons
      const outputVal = parseInt(outputValStr, 10);
      if (isNaN(outputVal) || outputVal !== 1008) {
        feedbackBox.textContent = 'Incorrect comparison count! The minimum comparisons required for 1,000 numbers is 1008 (999 + 9).';
        feedbackBox.className = 'feedback-box error show';
        outputInput.classList.add('error-border');
        if (window.soundController) window.soundController.playErrorSound();
        if (window.app) window.app.deductLife();
        return;
      }

      // SUCCESS! All inputs valid
      feedbackBox.textContent = 'Correct! Minimum comparisons = 1008 (999 comparisons to find largest + 9 for second largest). Level 1 Completed!';
      feedbackBox.className = 'feedback-box success show';
      nInput.classList.add('success-border');
      codeInput.classList.add('success-border');
      outputInput.classList.add('success-border');

      if (window.soundController) window.soundController.playSuccessChime();
      if (window.app) window.app.completeDoor('door3');

      if (claimMapBtn) claimMapBtn.classList.add('active');

      setTimeout(() => {
        if (this.currentDoorId === 'door3' && window.app) {
          window.app.navigateTo('scene-4');
        }
      }, 1800);
    };

    submitBtn.addEventListener('click', handleSubmit);

    if (claimMapBtn) {
      claimMapBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playSuccessChime();
        if (window.app) window.app.navigateTo('scene-4');
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.soundController) window.soundController.playHoverChime(400);
        if (window.app) window.app.navigateTo('scene-2');
      });
    }

    this.bindQuestionTabEvents();
  }

  /* Physical Keyboard Listener */
  initKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (!window.app || window.app.currentSceneId !== 'scene-3') return;
      if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) return;
    });
  }
}

window.PlaceholderController = PlaceholderController;
