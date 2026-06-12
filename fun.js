/* =============================================
   Fun Zone — Microsoft Fabric quiz (local-only)
   ============================================= */
(function () {
  const QUESTIONS = [
    {
      q: 'Which Microsoft Fabric experience would you use to ingest, transform, and analyze high-volume streaming data?',
      options: [
        'Power BI',
        'Real-Time Intelligence',
        'Data Warehouse',
        'Data Activator',
      ],
      answer: 1,
      explain:
        'Real-Time Intelligence (Eventstreams + Eventhouse / KQL + Real-Time Dashboards) is purpose-built for high-throughput streaming and event data.',
    },
    {
      q: 'OneLake is best described as…',
      options: [
        'A SQL database engine',
        'The "OneDrive for data" — a single SaaS data lake for the whole tenant',
        'A Power BI feature for caching reports',
        'A connector library',
      ],
      answer: 1,
      explain:
        'OneLake is the unified, tenant-wide SaaS data lake that underpins every Fabric workload. One copy of data, many engines.',
    },
    {
      q: 'You need to copy data from 170+ sources into Fabric on a schedule with minimal code. The fastest item to use is…',
      options: ['Spark Notebook', 'Copy Job', 'Eventhouse', 'Direct Lake'],
      answer: 1,
      explain:
        'Copy Job is the modern, wizard-driven data movement item in Fabric Data Factory — built for low-code, high-scale ingestion.',
    },
    {
      q: 'Which Power BI storage mode reads OneLake Delta tables directly with no import and no DirectQuery latency?',
      options: ['Import', 'DirectQuery', 'Direct Lake', 'Live Connection'],
      answer: 2,
      explain:
        'Direct Lake mode loads Parquet/Delta files from OneLake into Power BI memory on demand — no scheduled refresh, no DirectQuery hop.',
    },
    {
      q: 'In the medallion lakehouse pattern, the layer that contains business-ready aggregates for BI is called…',
      options: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      answer: 2,
      explain:
        'Bronze = raw, Silver = cleaned/conformed, Gold = curated business marts. There is no Platinum layer (yet 😉).',
    },
  ];

  const REACTIONS = {
    perfect: { emoji: '🏆', label: 'Fabric Wizard!', sub: 'Direct Lake speed. 5 / 5.' },
    great:   { emoji: '🚀', label: 'Nicely done!', sub: 'You clearly know your Lakehouse from your Warehouse.' },
    good:    { emoji: '💡', label: 'Not bad!', sub: 'A solid foundation — try the docs section next.' },
    learn:   { emoji: '📚', label: 'Time to brush up', sub: 'Head to Useful Resources and run it back!' },
  };

  let current = 0;
  let score = 0;
  let answered = false;

  // ----- Element refs (lazy, in case section is removed) -----
  const $ = (id) => document.getElementById(id);

  function init() {
    if (!$('quiz-question')) return;
    bind();
    render();
  }

  function bind() {
    $('quiz-next').addEventListener('click', () => {
      if (!answered) return;
      current += 1;
      answered = false;
      if (current >= QUESTIONS.length) {
        showResult();
      } else {
        render();
      }
    });
    $('quiz-restart').addEventListener('click', () => {
      current = 0;
      score = 0;
      answered = false;
      $('quiz-result').hidden = true;
      $('quiz-body').style.display = '';
      render();
    });
  }

  function render() {
    const item = QUESTIONS[current];
    $('quiz-counter').textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
    $('quiz-score').textContent = `Score: ${score}`;
    $('quiz-progress-fill').style.width = `${(current / QUESTIONS.length) * 100}%`;
    $('quiz-question').textContent = item.q;
    $('quiz-feedback').textContent = '';
    $('quiz-feedback').className = 'quiz-feedback';
    $('quiz-next').disabled = true;
    $('quiz-next').textContent = current === QUESTIONS.length - 1 ? 'See result →' : 'Next →';

    const opts = $('quiz-options');
    opts.innerHTML = '';
    item.options.forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', () => choose(btn, idx));
      opts.appendChild(btn);
    });
  }

  function choose(btn, idx) {
    if (answered) return;
    answered = true;
    const item = QUESTIONS[current];
    const correct = idx === item.answer;
    if (correct) score += 1;

    // Disable & mark all options
    const all = document.querySelectorAll('#quiz-options .quiz-option');
    all.forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add('is-correct');
      if (i === idx && !correct) b.classList.add('is-wrong');
    });

    const fb = $('quiz-feedback');
    if (correct) {
      fb.textContent = '✅ Correct! ' + item.explain;
      fb.classList.add('is-correct');
    } else {
      fb.textContent = '❌ Not quite. ' + item.explain;
      fb.classList.add('is-wrong');
    }
    $('quiz-score').textContent = `Score: ${score}`;
    $('quiz-next').disabled = false;
  }

  function showResult() {
    const pct = score / QUESTIONS.length;
    let r;
    if (pct === 1)        r = REACTIONS.perfect;
    else if (pct >= 0.8)  r = REACTIONS.great;
    else if (pct >= 0.5)  r = REACTIONS.good;
    else                  r = REACTIONS.learn;

    $('quiz-progress-fill').style.width = '100%';
    $('quiz-counter').textContent = `Done — ${score} / ${QUESTIONS.length}`;
    $('quiz-body').style.display = 'none';

    const out = $('quiz-result');
    out.hidden = false;
    out.innerHTML = `
      <div class="quiz-trophy" aria-hidden="true">${r.emoji}</div>
      <h3>${r.label}</h3>
      <p class="quiz-result-sub">${r.sub}</p>
      <p class="quiz-final-score">You scored <strong>${score} / ${QUESTIONS.length}</strong></p>
      <button class="btn btn-primary" id="quiz-result-restart" type="button">Play again</button>
    `;
    out.querySelector('#quiz-result-restart').addEventListener('click', () => {
      $('quiz-restart').click();
    });

    // Tiny confetti-ish burst for perfect score
    if (pct === 1) burstConfetti(out);
  }

  function burstConfetti(host) {
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('span');
      dot.className = 'confetti-dot';
      dot.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px');
      dot.style.setProperty('--dy', (-80 - Math.random() * 160) + 'px');
      dot.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      dot.style.setProperty(
        '--hue',
        ['#2AC2A0', '#117865', '#F2C811', '#0364B8', '#D83B01', '#B146C2'][i % 6]
      );
      host.appendChild(dot);
      setTimeout(() => dot.remove(), 1400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
