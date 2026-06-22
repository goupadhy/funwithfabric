// =============================================
// FUN ZONE GAMES - Workload Match & Speed Challenge
// =============================================

// Workload matching data
const workloadMappings = {
  'data-engineering': 'PySpark & Delta transformations 🔥',
  'data-factory': 'Orchestrate pipelines & jobs 🎯',
  'warehouse': 'SQL analytics at scale 🚀',
  'real-time': 'Streaming events in milliseconds ⚡',
  'data-science': 'ML models & Python notebooks 🤖',
  'power-bi': 'Beautiful visualizations & dashboards ✨'
};

const speedChallengeData = [
  { prompt: 'Which transforms data with Spark?', correct: 'data-engineering', options: ['data-engineering', 'warehouse', 'power-bi'] },
  { prompt: 'Which creates dashboards?', correct: 'power-bi', options: ['power-bi', 'data-factory', 'warehouse'] },
  { prompt: 'Which ingests streaming data?', correct: 'real-time', options: ['real-time', 'warehouse', 'data-science'] },
  { prompt: 'Which runs SQL queries?', correct: 'warehouse', options: ['warehouse', 'data-science', 'data-factory'] },
  { prompt: 'Which orchestrates pipelines?', correct: 'data-factory', options: ['data-factory', 'power-bi', 'real-time'] },
  { prompt: 'Which builds ML models?', correct: 'data-science', options: ['data-science', 'power-bi', 'data-factory'] },
  { prompt: 'Which does real-time analytics?', correct: 'real-time', options: ['real-time', 'warehouse', 'data-science'] },
  { prompt: 'Which unifies all workloads?', correct: 'data-engineering', options: ['data-engineering', 'power-bi', 'warehouse'] },
  { prompt: 'Which creates reports?', correct: 'power-bi', options: ['power-bi', 'real-time', 'data-factory'] },
  { prompt: 'Which handles ETL?', correct: 'data-factory', options: ['data-factory', 'data-science', 'real-time'] }
];

// =============================================
// WORKLOAD MATCH GAME
// =============================================
let matchedPairs = new Set();

function initMatchGame() {
  const matchGame = document.getElementById('match-game');
  if (!matchGame) return;

  matchGame.addEventListener('click', (event) => {
    const reset = event.target.closest('#match-reset');
    if (reset) {
      resetMatchGame();
      return;
    }

    const btn = event.target.closest('.match-btn');
    if (!btn || !matchGame.contains(btn)) {
      return;
    }

    handleMatchClick(btn);
  });
}

function handleMatchClick(btn) {
  if (btn.classList.contains('matched')) return;
  
  const workload = btn.dataset.workload;
  const matchGame = document.getElementById('match-game');
  if (!matchGame || !workload) return;

  const allBtns = matchGame.querySelectorAll('.match-btn');
  const definitions = matchGame.querySelectorAll('.match-def');
  const counter = matchGame.querySelector('#match-counter');

  allBtns.forEach(b => {
    if (!b.classList.contains('matched')) {
      b.classList.remove('active');
    }
  });
  btn.classList.add('active');
  
  // Show matching definition
  definitions.forEach(def => {
    if (def.dataset.for === workload) {
      def.classList.add('active');
      // Auto-match after brief display
      setTimeout(() => {
        btn.classList.remove('active');
        btn.classList.add('matched');
        matchedPairs.add(workload);
        def.classList.remove('active');

        if (counter) {
          counter.textContent = `${matchedPairs.size}/6 matched`;
        }
        
        if (matchedPairs.size === 6) {
          showMatchGameVictory(matchGame);
        }
      }, 450);
    } else {
      def.classList.remove('active');
    }
  });
}

function showMatchGameVictory(matchGame) {
  const counter = matchGame.querySelector('#match-counter');
  counter.innerHTML = '🎉 You won! All matched!';
  counter.style.color = 'var(--color-primary)';
}

function resetMatchGame() {
  matchedPairs.clear();
  const matchGame = document.getElementById('match-game');
  if (!matchGame) return;

  const matchBtns = matchGame.querySelectorAll('.match-btn');
  const definitions = matchGame.querySelectorAll('.match-def');
  const counter = matchGame.querySelector('#match-counter');
  
  matchBtns.forEach(btn => btn.classList.remove('matched', 'active'));
  definitions.forEach(def => def.classList.remove('active'));
  if (counter) {
    counter.textContent = '0/6 matched';
    counter.style.color = 'var(--color-primary)';
  }
}

// =============================================
// SPEED CHALLENGE GAME
// =============================================
let speedGameState = {
  isRunning: false,
  timeRemaining: 30,
  score: 0,
  currentRound: 0,
  totalRounds: 10,
  timerInterval: null,
  usedIndices: new Set()
};

function initSpeedGame() {
  const speedGame = document.getElementById('speed-game');
  if (!speedGame) return;

  const startBtn = speedGame.querySelector('#speed-start');
  const restartBtn = speedGame.querySelector('#speed-restart');
  
  startBtn.addEventListener('click', startSpeedGame);
  restartBtn.addEventListener('click', resetSpeedGame);
}

function startSpeedGame() {
  const speedGame = document.getElementById('speed-game');
  speedGameState.isRunning = true;
  speedGameState.timeRemaining = 30;
  speedGameState.score = 0;
  speedGameState.currentRound = 0;
  speedGameState.usedIndices.clear();
  
  speedGame.querySelector('#speed-start').hidden = true;
  speedGame.querySelector('#speed-restart').hidden = true;
  
  loadSpeedRound();
  startSpeedTimer();
}

function startSpeedTimer() {
  const speedGame = document.getElementById('speed-game');
  speedGameState.timerInterval = setInterval(() => {
    speedGameState.timeRemaining--;
    speedGame.querySelector('#speed-timer').textContent = speedGameState.timeRemaining + 's';
    
    if (speedGameState.timeRemaining <= 0) {
      endSpeedGame();
    }
  }, 1000);
}

function loadSpeedRound() {
  if (speedGameState.currentRound >= speedGameState.totalRounds) {
    endSpeedGame();
    return;
  }

  const speedGame = document.getElementById('speed-game');
  const prompt = speedGame.querySelector('#speed-prompt');
  const choices = speedGame.querySelector('#speed-choices');
  
  // Pick a random question
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * speedChallengeData.length);
  } while (speedGameState.usedIndices.has(randomIndex) && speedGameState.usedIndices.size < speedChallengeData.length);
  
  speedGameState.usedIndices.add(randomIndex);
  const question = speedChallengeData[randomIndex];
  
  prompt.textContent = question.prompt;
  
  // Shuffle options
  const shuffled = [...question.options].sort(() => Math.random() - 0.5);
  
  choices.innerHTML = shuffled.map(workload => `
    <button class="speed-choice-btn" data-workload="${workload}">
      ${workload.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
    </button>
  `).join('');
  
  // Add event listeners
  choices.querySelectorAll('.speed-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleSpeedChoice(btn, question.correct));
  });
  
  speedGameState.currentRound++;
}

function handleSpeedChoice(btn, correct) {
  if (!speedGameState.isRunning) return;
  
  const speedGame = document.getElementById('speed-game');
  const allBtns = speedGame.querySelectorAll('.speed-choice-btn');
  
  allBtns.forEach(b => b.disabled = true);
  
  if (btn.dataset.workload === correct) {
    btn.classList.add('correct');
    speedGameState.score++;
    speedGame.querySelector('#speed-score').textContent = `Score: ${speedGameState.score}/${speedGameState.totalRounds}`;
  } else {
    btn.classList.add('wrong');
    speedGame.querySelectorAll(`[data-workload="${correct}"]`)[0]?.classList.add('correct');
  }
  
  setTimeout(() => {
    allBtns.forEach(b => b.disabled = false);
    if (speedGameState.isRunning && speedGameState.currentRound < speedGameState.totalRounds) {
      loadSpeedRound();
    }
  }, 800);
}

function endSpeedGame() {
  clearInterval(speedGameState.timerInterval);
  speedGameState.isRunning = false;
  
  const speedGame = document.getElementById('speed-game');
  const prompt = speedGame.querySelector('#speed-prompt');
  const choices = speedGame.querySelector('#speed-choices');
  
  const percentage = Math.round((speedGameState.score / speedGameState.totalRounds) * 100);
  prompt.textContent = `🎉 Game Over! ${percentage}% Correct (${speedGameState.score}/${speedGameState.totalRounds})`;
  choices.innerHTML = '';
  
  speedGame.querySelector('#speed-start').hidden = true;
  speedGame.querySelector('#speed-restart').hidden = false;
}

function resetSpeedGame() {
  clearInterval(speedGameState.timerInterval);
  const speedGame = document.getElementById('speed-game');
  
  speedGameState = {
    isRunning: false,
    timeRemaining: 30,
    score: 0,
    currentRound: 0,
    totalRounds: 10,
    timerInterval: null,
    usedIndices: new Set()
  };
  
  speedGame.querySelector('#speed-timer').textContent = '30s';
  speedGame.querySelector('#speed-score').textContent = 'Score: 0/10';
  speedGame.querySelector('#speed-prompt').textContent = 'Click START to begin!';
  speedGame.querySelector('#speed-choices').innerHTML = '';
  speedGame.querySelector('#speed-start').hidden = false;
  speedGame.querySelector('#speed-restart').hidden = true;
}

// Initialize games when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMatchGame();
    initSpeedGame();
  });
} else {
  initMatchGame();
  initSpeedGame();
}
