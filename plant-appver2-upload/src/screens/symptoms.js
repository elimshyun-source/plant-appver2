// 3. 증상 고르기: 증상 하나 + 맨 아래 "여기에 없어요"
import { findPlant, setResult } from '../store.js';
import { track, stepView, stepLeave } from '../lib/analytics.js';
import { getSymptoms } from '../content/symptoms.js';
import { getFlow, visibleSymptoms } from '../flow.js';
import { icons } from '../components/parts.js';
import { esc, t } from '../lib/text.js';

const NOT_HERE = '__not_here__';

export function renderSymptoms(root, plantId) {
  const plant = findPlant(plantId);
  if (!plant) { location.replace('#/'); return; }
  const f = getFlow(plantId);
  const { notHere } = getSymptoms();

  const options = [
    ...visibleSymptoms().map((s) => ({ value: s.name, label: s.name })),
    { value: NOT_HERE, label: notHere },
  ];

  root.innerHTML = `
    <section class="question">
      <div class="screen-head q-head">
        <h1 class="t-title" data-clarity-mask="true">${t('symptom.title', { nickname: plant.nickname })}</h1>
        <p class="t-desc">${t('symptom.guide')}</p>
      </div>
      <ul class="choices q-choices" role="radiogroup">
        ${options.map((o) => `<li><button type="button" role="radio" class="choice t-choice"
            aria-checked="false" data-value="${esc(o.value)}"><span>${esc(o.label)}</span>${icons.check}</button></li>`).join('')}
      </ul>
      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <a class="btn btn-secondary" href="#/" data-prev>${t('question.prev')}</a>
        <button class="btn btn-primary" type="button" data-next>${t('question.next')}</button>
      </div>
    </section>`;

  const current = () => (f.symptom === 'none' ? NOT_HERE : f.symptom);
  const sync = () => {
    root.querySelectorAll('[data-value]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.value === current())));
  };

  root.querySelector('.choices').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-value]');
    if (!btn) return;
    const value = btn.dataset.value === NOT_HERE ? 'none' : btn.dataset.value;
    // 하나만 고른다. 고른 것을 다시 누르면 풀린다. 증상이 바뀌면 지난 답은 지운다.
    f.symptom = f.symptom === value ? null : value;
    f.answers = {};
    sync();
  });

  root.querySelector('[data-prev]').addEventListener('click', () => stepLeave('symptom', 'prev'));
  root.querySelector('[data-next]').addEventListener('click', () => {
    stepLeave('symptom', 'next');
    if (f.symptom == null) {
      // 증상을 고르지 않으면 "괜찮아요"로 저장하고 홈으로 (CLAUDE.md)
      setResult(plantId, 'ok', null);
      track('diagnose_ok');
      track('diagnose_done');
      location.hash = '#/';
    } else if (f.symptom === 'none') {
      // "여기에 없어요"는 막다른 화면을 보여주고 상태는 "괜찮아요"로 저장한다(11/20 결정)
      setResult(plantId, 'ok', null);
      location.hash = `#/plant/${plantId}/deadend`;
    } else {
      location.hash = `#/plant/${plantId}/q/0`;
    }
  });

  sync();
  stepView('symptom');
}
