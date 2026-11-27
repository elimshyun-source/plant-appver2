// 7. 진단 기록 (requirements.md "7. 진단 기록", 11/27)
// 목록: 날짜별 카드 → 상세: 그날 결과(지금 모습 · 이유 · 해야 할 일) + 메모
// 결과 글은 저장하지 않고 해결책 번호로 solutions.md에서 다시 읽는다.
import { getPlant, getHistory, findRecord, setMemo } from '../store.js';
import { solutionById, todoFor } from '../content/solutions.js';
import { icons, statusBadge } from '../components/parts.js';
import { section } from './result.js';
import { esc, t, tPlain } from '../lib/text.js';
import { track } from '../lib/analytics.js';

/** "2026-11-27" → "11월 27일" (ui-text.md history.date) */
function dateLabel(date) {
  const [, m, d] = date.split('-').map(Number);
  return t('history.date', { 월: m, 일: d });
}

function topBar(href) {
  return `<header class="top-bar"><a class="back" href="${href}" aria-label="${t('a11y.back')}">${icons.back}</a></header>`;
}

/* ---------- 목록 ---------- */
export function renderHistory(root) {
  const plant = getPlant();
  if (!plant) { location.replace('#/'); return; }
  const records = getHistory(plant.id);
  track('history_open');

  document.body.classList.add('bg-soft');
  root.innerHTML = `
    <section class="history">
      ${topBar('#/')}
      <div class="history-head">
        <h1 class="t-title" data-clarity-mask="true">${t('history.title', { nickname: plant.nickname })}</h1>
      </div>
      ${records.length
        ? `<ul class="history-list">
            ${records.map((r) => `<li><a class="card history-card" href="#/history/${esc(r.id)}">
              <p class="t-name">${dateLabel(r.date)}</p>
              ${statusBadge(r.level)}
              <p class="t-body history-symptom">${esc(r.symptom || '')}</p>
              ${r.memo ? `<p class="t-desc history-memo" data-clarity-mask="true">${esc(r.memo.split('\n')[0])}</p>` : ''}
            </a></li>`).join('')}
          </ul>`
        : `<p class="t-desc history-empty">${t('history.empty')}</p>`}
    </section>`;
}

/* ---------- 상세 ---------- */
export function renderRecord(root, recordId) {
  const plant = getPlant();
  if (!plant) { location.replace('#/'); return; }
  const record = findRecord(plant.id, recordId);
  if (!record) { location.replace('#/history'); return; }
  track('history_detail_view');

  // 해결책이 solutions.md에서 없어졌으면 지어내지 않고 막다른 문구를 보여준다
  const sol = solutionById(record.solutionId);
  let body;
  if (sol) {
    const { todo, extra } = todoFor(sol, plant.kind);
    body = `
      ${sol.draft ? `<p class="t-desc unsure">${t('solution.unsure')}</p>` : ''}
      <div class="sections history-sections">
        ${section(t('solution.now'), esc(sol.now))}
        ${section(t('solution.reason'), esc(sol.reason))}
        ${section(t('solution.todo'), esc(todo), { extra, todo: true })}
      </div>`;
  } else {
    body = `<p class="t-body history-missing">${t('deadend.title')}</p>`;
  }

  document.body.classList.add('bg-soft');
  root.innerHTML = `
    <section class="history-record">
      ${topBar('#/history')}
      <div class="history-head">
        <h1 class="t-title">${dateLabel(record.date)}</h1>
        <div class="history-meta">
          ${statusBadge(record.level)}
          <p class="t-kind">${esc(record.symptom || '')}</p>
        </div>
      </div>
      ${body}
      <section class="card memo-card">
        <h2 class="card-label"><label for="memo">${t('history.memo.title')}</label></h2>
        <textarea id="memo" class="field memo-field" rows="4" data-clarity-mask="true"
          placeholder="${esc(tPlain('history.memo.placeholder'))}">${esc(record.memo || '')}</textarea>
        <div class="memo-actions">
          <p class="t-desc memo-status" role="status" aria-live="polite"></p>
          <button type="button" class="btn btn-primary" data-save>${t('history.memo.save')}</button>
        </div>
      </section>
    </section>`;

  const field = root.querySelector('#memo');
  const status = root.querySelector('.memo-status');
  field.addEventListener('input', () => { status.textContent = ''; });
  root.querySelector('[data-save]').addEventListener('click', () => {
    if (setMemo(plant.id, record.id, field.value.trim())) {
      status.textContent = tPlain('history.memo.saved');
      track('memo_saved');
    }
  });
}
