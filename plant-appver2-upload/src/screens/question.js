// 4. 질문: symptoms.md의 흐름대로 한 번에 한 질문
import { findPlant } from '../store.js';
import { getFlow, questionPath, questionFor, answer } from '../flow.js';
import { icons } from '../components/parts.js';
import { esc, format, t, tPlain } from '../lib/text.js';
import { stepView, stepLeave } from '../lib/analytics.js';

export function renderQuestion(root, plantId, index) {
  const plant = findPlant(plantId);
  if (!plant) { location.replace('#/'); return; }
  const f = getFlow(plantId);
  const path = questionPath(f, plant);
  const id = path[index];
  if (!f.symptom || f.symptom === 'none' || !id) { location.replace(`#/plant/${plantId}`); return; }

  const q = questionFor(id, f);
  // 첫 질문의 이전 질문은 증상 고르기로 (고른 증상은 남는다. design-system.md)
  const prevHref = index === 0 ? `#/plant/${esc(plantId)}` : `#/plant/${esc(plantId)}/q/${index - 1}`;

  root.innerHTML = `
    <section class="question">
      <div class="screen-head q-head">
        <h1 class="t-title" data-clarity-mask="true">${titleHtml(q, plant)}</h1>
        ${q.guide ? `<p class="t-desc">${esc(q.guide)}</p>` : ''}
        ${q.guideKey ? `<p class="t-desc">${t(q.guideKey)}</p>` : ''}
      </div>
      <ul class="choices q-choices" role="radiogroup">
        ${q.answers.map((a) => `<li><button type="button" role="radio" class="choice t-choice"
            aria-checked="${f.answers[id] === a.label}" data-value="${esc(a.label)}"><span>${esc(a.label)}</span>${icons.check}</button></li>`).join('')}
      </ul>
      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        <a class="btn btn-secondary" href="${prevHref}" data-prev>${t('question.prev')}</a>
        <button class="btn btn-primary" type="button" data-next>${t('question.next')}</button>
      </div>
    </section>`;

  const next = root.querySelector('[data-next]');
  const sync = () => {
    root.querySelectorAll('[data-value]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.value === f.answers[id])));
    next.disabled = f.answers[id] == null;
  };

  root.querySelector('.choices').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-value]');
    if (!btn) return;
    answer(f, id, btn.dataset.value);
    sync();
  });

  next.addEventListener('click', () => {
    if (f.answers[id] == null) return;
    stepLeave(id, 'next');
    const after = questionPath(f, plant);
    if (after.length > index + 1) location.hash = `#/plant/${plantId}/q/${index + 1}`;
    else location.hash = `#/plant/${plantId}/result`;
  });

  root.querySelector('[data-prev]').addEventListener('click', () => stepLeave(id, 'prev'));

  sync();
  stepView(id);
}

/** 질문 제목: 별명을 넣고, ui-text.md에 적힌 단어 하나만 강조한다. */
function titleHtml(q, plant) {
  const word = q.emphasisKey ? tPlain(q.emphasisKey) : '';
  let raw = q.title;
  if (word && raw.includes(word) && !raw.includes('**')) raw = raw.replace(word, `**${word}**`);
  return format(raw, { nickname: plant.nickname });
}
