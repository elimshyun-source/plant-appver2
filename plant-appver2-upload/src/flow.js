// 증상 질문 흐름: 고른 증상과 답에 따라 다음 질문을 정한다(symptoms.md의 조건을 따른다).
import { getSymptoms, ownQuestion, soilOnlyWhen, asksSoil, asksChange } from './content/symptoms.js';
import { tPlain } from './lib/text.js';
import { getContent } from './content/content.js';

// 햇빛 정도 답(11/25: 등록이 아니라 진단에서 묻는다). 글자는 ui-text.md question.light.*
export const LIGHTS = ['bright', 'normal', 'dark'];
export const lightLabel = (key) => tPlain(`question.light.${key}`);
export const lightKeyOf = (label) => LIGHTS.find((k) => lightLabel(k) === label) || null;

// 식물마다 지금 진행 중인 흐름 하나. 이전 질문으로 돌아가도 답이 남는다.
let flow = null;

export function startFlow(plantId) {
  flow = { plantId, symptom: null, answers: {} };
  return flow;
}

export function getFlow(plantId) {
  if (!flow || flow.plantId !== plantId) startFlow(plantId);
  return flow;
}

export function findSymptom(name) {
  for (const part of getSymptoms().parts) {
    const s = part.symptoms.find((x) => x.name === name);
    if (s) return s;
  }
  return null;
}

/** 지금 보여줄 수 있는 증상 목록. 부위가 하나뿐이면 "어디가 이상한가요?"는 건너뛴다. */
export function visibleSymptoms() {
  const { parts } = getSymptoms();
  // 지금은 부위가 "잎" 하나뿐이다. 부위가 늘면 부위 질문 화면을 먼저 만든다.
  return parts[0] ? parts[0].symptoms : [];
}

/**
 * 고른 증상과 지금까지의 답으로, 물어볼 질문 id 목록을 만든다.
 * 'own'(증상만의 질문) → 'soil'(흙 상태) → 'light'(햇빛 정도) → 'change'(최근 변화)
 * 아직 답하지 않은 질문에서 멈춘다.
 */
export function questionPath(f, plant) {
  const symptom = findSymptom(f.symptom);
  if (!symptom) return [];
  const { changeRule } = getSymptoms();
  const path = [];
  const a = f.answers;

  if (ownQuestion(symptom)) {
    path.push('own');
    if (a.own == null) return path;
  }

  if (asksSoil(symptom)) {
    const onlyWhen = soilOnlyWhen(symptom);
    if (!onlyWhen || a.own === onlyWhen) {
      path.push('soil');
      if (a.soil == null) return path;
    }
  }

  // 햇빛 정도는 증상을 고르면 늘 묻는다(흙 상태 다음, 최근 변화 전)
  path.push('light');
  if (a.light == null) return path;

  if (asksChange(symptom) && symptom.name === changeRule.symptom) {
    const ok = a.own === changeRule.count
      && a.soil === changeRule.soil
      && changeRule.lights.includes(a.light)
      && plant.kind !== changeRule.skipPlant;
    if (ok) path.push('change');
  }
  return path;
}

/** 질문 id → { title, guide, answers, emphasisKey } */
export function questionFor(id, f) {
  const sym = getSymptoms();
  if (id === 'own') return { ...ownQuestion(findSymptom(f.symptom)), emphasisKey: 'question.emphasis.count' };
  if (id === 'soil') return { ...sym.soil, emphasisKey: 'question.emphasis.soil' };
  if (id === 'light') {
    return { title: getContent().ui['question.light.title'], answers: LIGHTS.map((k) => ({ label: lightLabel(k) })) };
  }
  if (id === 'change') return { ...sym.change, guideKey: 'question.change.guide', emphasisKey: 'question.emphasis.change' };
  return null;
}

/** 답을 바꾸면 그 뒤 질문의 답은 지운다(흐름이 달라질 수 있어서). */
export function answer(f, id, value) {
  const order = ['own', 'soil', 'light', 'change'];
  if (f.answers[id] !== value) {
    for (const later of order.slice(order.indexOf(id) + 1)) delete f.answers[later];
  }
  f.answers[id] = value;
}

/**
 * 상태 단계: symptoms.md "상태 단계" 칸을 따른다.
 * 'ok' | 'help' | null
 */
export function levelFor(f) {
  const symptom = findSymptom(f.symptom);
  if (!symptom) return null;
  const okLabel = tPlain('status.ok');
  const helpLabel = tPlain('status.help');
  // 햇빛 정도 답은 상태 단계를 정하는 데 쓰지 않는다
  const { light, ...rest } = f.answers;
  const hit = symptom.levels.find((l) => l.when == null || Object.values(rest).includes(l.when));
  if (!hit) return null;
  if (hit.level === okLabel) return 'ok';
  if (hit.level === helpLabel) return 'help';
  return null;
}
