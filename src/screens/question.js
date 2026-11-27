// 4. 질문: symptoms.md의 흐름대로 한 번에 한 질문
import { findPlant } from '../store.js';
import { getFlow, questionPath, maxQuestionPath, questionFor, answer } from '../flow.js';
import { icons } from '../components/parts.js';
import { esc, format, t, tPlain } from '../lib/text.js';
import { stepView, stepLeave, track } from '../lib/analytics.js';

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
      <div class="q-progress"></div>
      <div class="screen-head q-head">
        ${q.help ? `<div class="title-row">
          <h1 class="t-title" data-clarity-mask="true">${titleHtml(q, plant)}</h1>
          <button type="button" class="icon-button help-btn" aria-expanded="false" aria-controls="q-help" aria-label="${esc(tPlain('a11y.soilHelp'))}">${icons.info}</button>
        </div>
        ${helpBubble(q)}` : `<h1 class="t-title" data-clarity-mask="true">${titleHtml(q, plant)}</h1>`}
        ${q.guide && !q.help ? `<p class="t-desc">${esc(q.guide)}</p>` : ''}
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
  const progress = root.querySelector('.q-progress');
  const sync = () => {
    renderProgress(progress, maxQuestionPath(f, plant).length, index + 1);
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
  if (q.help) bindHelp(root, q.help);

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

/* ---------- 확인 방법 툴팁 (requirements.md 4. 질문, 11/27) ---------- */
/** 말풍선: 확인 그림(있을 때만) → 안내 문구(본문 글씨) → 답과 설명. 글은 모두 symptoms.md에서 읽은 것. */
function helpBubble(q) {
  return `<div class="bubble help-bubble" id="q-help" hidden>
    ${q.helpImage ? `<img class="help-art" src="${esc(q.helpImage)}" alt="">` : ''}
    ${q.guide ? `<p class="t-body help-guide">${esc(q.guide)}</p>` : ''}
    <dl class="help-list">
      ${q.answers.filter((a) => a.desc).map((a) => `<div><dt class="t-name">${esc(a.label)}</dt><dd class="t-body">${esc(a.desc)}</dd></div>`).join('')}
    </dl>
  </div>`;
}

/** ⓘ를 누르면 열고 닫는다. 말풍선 밖을 누르거나 Esc를 누르면 닫는다. */
function bindHelp(root, name) {
  const btn = root.querySelector('.help-btn');
  const bubble = root.querySelector('#q-help');
  const outside = (e) => { if (!bubble.contains(e.target) && !btn.contains(e.target)) set(false); };
  const esc_ = (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } };
  function set(open) {
    bubble.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      document.addEventListener('click', outside, true);
      document.addEventListener('keydown', esc_);
    } else {
      document.removeEventListener('click', outside, true);
      document.removeEventListener('keydown', esc_);
    }
  }
  btn.addEventListener('click', () => {
    const open = bubble.hidden;
    set(open);
    if (open) track(`help_open_${name}`);
  });
  // 다른 화면으로 가면 열린 말풍선의 듣기를 정리한다
  window.addEventListener('hashchange', () => set(false), { once: true });
}

/* ---------- 진행 막대 (requirements.md 4. 질문, 11/27) ---------- */
/** 질문 수만큼 칸. 지나온 질문과 지금 질문은 초록. 답이 바뀌면 칸 수가 다시 정해진다 */
function renderProgress(el, total, current) {
  const all = Math.max(total, current);
  el.setAttribute('role', 'progressbar');
  el.setAttribute('aria-valuemin', '1');
  el.setAttribute('aria-valuemax', String(all));
  el.setAttribute('aria-valuenow', String(current));
  el.setAttribute('aria-valuetext', tPlain('a11y.progress', { 전체: all, 현재: current }));
  el.innerHTML = Array.from({ length: all }, (_, i) => `<span class="q-progress-seg${i < current ? ' is-done' : ''}"></span>`).join('');
}
