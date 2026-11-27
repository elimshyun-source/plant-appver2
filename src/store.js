// 내 식물 저장소. 브라우저(localStorage)에만 저장한다.
import { getContent } from './content/content.js';
// 식물은 하나만 등록한다(11/25). 저장 모양은 예전 칸 목록을 그대로 쓰고, 첫 식물 하나만 쓴다.

const KEY = 'plant-app/v1';
export const SLOT_COUNT = 9;

function emptyState() {
  return { slots: Array(SLOT_COUNT).fill(null) };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    if (!Array.isArray(data.slots)) return emptyState();
    const slots = data.slots.slice(0, SLOT_COUNT);
    while (slots.length < SLOT_COUNT) slots.push(null);
    return { slots };
  } catch {
    return emptyState();
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    // 저장하지 못해도 화면은 계속 쓸 수 있게 둔다.
    return false;
  }
}

let state = read();

export function getSlots() {
  return state.slots;
}

export function findPlant(id) {
  return ensureArt(state.slots.find((p) => p && p.id === id) || null);
}

/** 식물 그림 번호를 랜덤으로 하나 (plants.md "식물 그림") */
function randomArt() {
  const arts = getContent().art;
  return arts.length ? arts[Math.floor(Math.random() * arts.length)].no : null;
}

/** 그림 번호가 없는(예전) 식물은 처음 볼 때 한 번 정해서 저장한다 */
function ensureArt(plant) {
  if (plant && plant.art == null) {
    plant.art = randomArt();
    write(state);
  }
  return plant;
}

/** 등록한 식물 하나(없으면 null) */
export function getPlant() {
  return ensureArt(state.slots.find((p) => p) || null);
}

/** 식물이 없을 때만 등록할 수 있다 */
export function canRegister() {
  return !getPlant();
}

/**
 * 식물 하나를 첫 빈 칸에 넣는다.
 * plant: { kind, nickname } — 햇빛 정도(light)는 진단할 때 저장한다(setLight)
 */
export function addPlant({ kind, nickname }) {
  if (!canRegister()) return null;
  const index = state.slots.findIndex((p) => p === null);
  if (index < 0) return null;
  const plant = {
    id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    kind,
    nickname,
    light: null,           // 'bright' | 'normal' | 'dark' — 진단에서 고른 것
    art: randomArt(),      // 식물 그림 번호(등록할 때 랜덤, 이후 그대로)
    status: null,          // null | 'ok' | 'help'
    lastSolution: null,    // 마지막으로 본 해결책 번호
  };
  state.slots[index] = plant;
  write(state);
  return plant;
}

export function removePlant(id) {
  const index = state.slots.findIndex((p) => p && p.id === id);
  if (index < 0) return;
  state.slots[index] = null;
  write(state);
}

/** 상태와 마지막으로 본 해결책 번호를 저장한다. status: 'ok' | 'help' | null */
export function setResult(id, status, lastSolution = null) {
  const plant = findPlant(id);
  if (!plant) return;
  plant.status = status;
  plant.lastSolution = lastSolution;
  write(state);
}

/** 진단에서 고른 햇빛 정도를 저장한다. light: 'bright' | 'normal' | 'dark' */
export function setLight(id, light) {
  const plant = findPlant(id);
  if (!plant) return;
  plant.light = light;
  write(state);
}

/* ---------- 진단 기록 (requirements.md 7. 진단 기록, 11/27) ---------- */
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * 결과 화면에 온 진단을 남긴다. 같은 날 같은 해결책이면 새로 쌓지 않고
 * 그날 기록의 시각·상태·햇빛 정도만 새로 고치고 맨 위로 올린다(메모는 그대로).
 */
export function addHistory(plantId, { level, solutionId, symptom, light }) {
  const plant = findPlant(plantId);
  if (!plant) return null;
  if (!Array.isArray(plant.history)) plant.history = [];
  const date = todayKey();
  const at = new Date().toISOString();
  const i = plant.history.findIndex((r) => r.date === date && r.solutionId === solutionId);
  let record;
  if (i >= 0) {
    [record] = plant.history.splice(i, 1);
    Object.assign(record, { at, level, symptom, light });
  } else {
    record = { id: `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, date, at, level, solutionId, symptom, light, memo: '' };
  }
  plant.history.unshift(record);
  write(state);
  return record;
}

/** 기록 목록(최근 것이 위) */
export function getHistory(plantId) {
  const plant = findPlant(plantId);
  return plant && Array.isArray(plant.history) ? plant.history : [];
}

export function findRecord(plantId, recordId) {
  return getHistory(plantId).find((r) => r.id === recordId) || null;
}

/** 메모를 저장한다. 저장에 성공하면 true */
export function setMemo(plantId, recordId, memo) {
  const record = findRecord(plantId, recordId);
  if (!record) return false;
  record.memo = memo;
  return write(state);
}
