// solutions.md를 읽어, 고른 증상·답·식물에 맞는 해결책 하나를 찾는다.
// 화면에 보이는 문장은 모두 solutions.md에서 그대로 가져온다.
import { loadMd } from './md.js';

let list = null;

export async function loadSolutions() {
  if (list) return list;
  const md = await loadMd('solutions.md');
  list = [];
  // "## S-01 ..." 덩어리마다 하나
  const blocks = md.split(/^(?=## S-\d+)/m).filter((b) => /^## S-\d+/.test(b));
  for (const block of blocks) {
    const id = block.match(/^## (S-\d+)/)[1];
    const field = (name) => ((block.match(new RegExp(`^- ${name}:\\s*(.*)$`, 'm')) || [])[1] || '').trim();
    list.push({
      id,
      when: parseWhen(field('대상 증상')),
      plants: parsePlants(field('대상 식물')),
      now: field('지금 모습'),
      reason: field('이유'),
      todo: field('해야 할 일'),
      perPlant: parsePerPlant(block),
      draft: /\[초안\]/.test(field('상태')),
    });
  }
  return list;
}

/**
 * "잎이 노래요 + 여러 장 + 흙이 보통이에요 + 진단에서 고른 햇빛 정도가 "밝아요/보통" + 최근 변화: 달라진 게 없어요"
 * → { symptom, own, soil, lights, change }
 */
function parseWhen(text) {
  const parts = text.split(/\s\+\s/).map((s) => s.trim());
  const when = { symptom: parts.shift() || '', own: null, soil: null, lights: null, change: null };
  for (const p of parts) {
    if (p.startsWith('흙이 ')) when.soil = p.slice(3).trim();
    else if (p.includes('햇빛 정도가')) when.lights = (p.match(/"([^"]+)"/) || [, ''])[1].split('/').map((s) => s.trim());
    else if (p.startsWith('최근 변화:')) when.change = p.slice('최근 변화:'.length).trim();
    else when.own = p;
  }
  return when;
}

/** "모든 식물" / "로즈마리를 뺀 모든 식물" / "로즈마리" */
function parsePlants(text) {
  if (text === '모든 식물') return { all: true, except: [], only: [] };
  const ex = text.match(/^(.+?)[을를]\s*뺀 모든 식물$/);
  if (ex) return { all: true, except: ex[1].split(',').map((s) => s.trim()), only: [] };
  return { all: false, except: [], only: text.split(',').map((s) => s.trim()) };
}

/** "  - 스킨답서스, 스파티필럼: 문장" → { 스킨답서스: 문장, 스파티필럼: 문장 } */
function parsePerPlant(block) {
  const start = block.search(/^- 식물별 안내:/m);
  if (start < 0) return {};
  const out = {};
  for (const line of block.slice(start).split('\n').slice(1)) {
    const m = line.match(/^\s{2,}-\s+([^:]+):\s*(.+)$/);
    if (!m) break;
    for (const name of m[1].split(',')) out[name.trim()] = m[2].trim();
  }
  return out;
}

function plantOk(sol, kind) {
  if (sol.plants.all) return !sol.plants.except.includes(kind);
  return sol.plants.only.includes(kind);
}

/**
 * 맞는 해결책 하나. 없으면 null (→ 막다른 화면).
 * answers: { own, soil, change }, lightLabel: '밝아요' | '보통' | '어두워요'
 * 조건이 모두 맞는 것 가운데 조건이 가장 많은(가장 자세한) 것을 고른다.
 */
export function findSolution({ symptom, answers, kind, lightLabel }) {
  let best = null;
  let bestScore = -1;
  for (const sol of list) {
    const w = sol.when;
    if (w.symptom !== symptom || !plantOk(sol, kind)) continue;
    if (w.own != null && w.own !== answers.own) continue;
    if (w.soil != null && w.soil !== answers.soil) continue;
    if (w.lights != null && !w.lights.includes(lightLabel)) continue;
    if (w.change != null && w.change !== answers.change) continue;
    // 사용자가 답한 질문을 해결책이 조건으로 쓰지 않으면, 더 맞는 해결책이 있을 수 있다
    const score = [w.own, w.soil, w.lights, w.change, sol.plants.all ? null : 1].filter((x) => x != null).length;
    if (score > bestScore) { best = sol; bestScore = score; }
  }
  return best;
}

/**
 * 해야 할 일 + 식물별 안내.
 * 식물별 안내가 '"…" 문장은 보여주지 않아요'이면, 해야 할 일에서 그 말이 든 문장을 뺀다.
 */
export function todoFor(sol, kind) {
  let todo = sol.todo;
  let extra = sol.perPlant[kind] || '';
  const hide = extra.match(/^"([^"]+)"\s*문장은 보여주지 않아요/);
  if (hide) {
    const sentences = todo.match(/[^.?!]+[.?!]?/g) || [todo];
    todo = sentences.filter((s) => !s.includes(hide[1])).join('').trim();
    extra = '';
  }
  return { todo, extra };
}
