// 5. 해결책: 별명 · 종류 · 상태 → 화분 + 식물 → 지금 모습 말풍선 → 이유 · 해야 할 일 카드 (requirements.md "화면 짜임")
// 6. 막다른 화면: 해결책이 없거나 "여기에 없어요"를 골랐을 때
import { findPlant, setResult, setLight } from '../store.js';
import { findSolution, todoFor } from '../content/solutions.js';
import { getFlow, levelFor, questionPath, lightKeyOf } from '../flow.js';
import { potWithPlant, statusBadge } from '../components/parts.js';
import { esc, t } from '../lib/text.js';
import { track, tag, resultView } from '../lib/analytics.js';

const POT_RIM_PX = 112; // 결과 화면 화분 테두리 너비 [제안]

export function renderResult(root, plantId) {
  const plant = findPlant(plantId);
  if (!plant) { location.replace('#/'); return; }
  const f = getFlow(plantId);
  // 새로고침 등으로 고른 내용이 없으면 증상 고르기부터 다시
  if (!f.symptom) { location.replace(`#/plant/${plantId}`); return; }
  if (f.symptom === 'none') { location.replace(`#/plant/${plantId}/deadend`); return; }

  // 모든 질문에 답했는지 확인 (주소를 직접 열었을 때 대비)
  const path = questionPath(f, plant);
  if (path.some((id) => f.answers[id] == null)) { location.replace(`#/plant/${plantId}`); return; }

  const sol = findSolution({
    symptom: f.symptom,
    answers: f.answers,
    kind: plant.kind,
    lightLabel: f.answers.light,
  });
  if (!sol) { location.replace(`#/plant/${plantId}/deadend`); return; }

  // 상태는 식물에 저장해서 홈에도 보여준다. 고른 햇빛 정도도 식물에 저장한다
  const level = levelFor(f);
  setResult(plantId, level, sol.id);
  setLight(plantId, lightKeyOf(f.answers.light));
  tag('result_level', level);
  tag('result_solution', sol.id);
  track('result_view');
  resultView();
  track('diagnose_done');

  const { todo, extra } = todoFor(sol, plant.kind);

  document.body.classList.add('bg-soft');
  root.innerHTML = `
    <section class="result">
      <header class="top-bar">
        <a class="back" href="#/" aria-label="${t('a11y.back')}">
          <svg width="10" height="19" viewBox="0 0 10 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 1 L1 9.5 L9 18"/></svg>
        </a>
      </header>

      <div class="result-head">
        <h1 class="t-title" data-clarity-mask="true">${esc(plant.nickname)}</h1>
        <p class="t-kind result-meta">${esc(plant.kind)}</p>
      </div>

      <div class="result-plant">${potWithPlant(plant.art, POT_RIM_PX)}</div>
      <div class="bubble">
        ${statusBadge(level)}
        <p class="t-body">${esc(sol.now)}</p>
      </div>

      ${sol.draft ? `<p class="t-desc unsure">${t('solution.unsure')}</p>` : ''}

      <div class="sections">
        ${section(t('solution.reason'), esc(sol.reason))}
        ${section(t('solution.todo'), esc(todo), { extra, todo: true })}
      </div>
    </section>`;
}

/** 구역 카드: 작은 굵은 제목 + 본문. 해야 할 일은 제목을 초록으로, 식물별 안내는 가는 선 아래에 */
function section(title, body, { extra = '', todo = false } = {}) {
  return `<section class="card sol-card${todo ? ' is-todo' : ''}">
    <h2 class="card-label">${title}</h2>
    <p class="t-body">${body}</p>
    ${extra ? `<p class="t-body sol-extra">${esc(extra)}</p>` : ''}
  </section>`;
}

export function renderDeadend(root, plantId) {
  // 안내가 없는 조합은 상태 자리를 비워 둔다(design-system.md "상태 표시").
  // 지난번에 본 상태가 남아 있으면 사용자가 그 상태로 오해할 수 있어서 지운다.
  // 단, "여기에 없어요"로 온 경우는 증상 고르기에서 이미 "괜찮아요"로 저장했으니 지우지 않는다.
  const f = getFlow(plantId);
  if (findPlant(plantId) && f.symptom && f.symptom !== 'none') setResult(plantId, null, null);
  track('deadend_view');
  track('diagnose_done');

  root.innerHTML = `
    <section class="deadend">
      <div class="screen-head">
        <h1 class="t-title">${t('deadend.title')}</h1>
        <p class="t-desc">${t('deadend.guide')}</p>
      </div>
      <a class="btn btn-secondary deadend-btn" href="#/">${t('deadend.home')}</a>
    </section>`;
}
