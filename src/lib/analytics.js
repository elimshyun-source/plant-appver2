// 사용 데이터 이벤트 (requirements.md "사용 데이터 (Clarity)").
// Clarity가 꺼져 있으면(내 컴퓨터에서 열 때) 아무것도 하지 않는다.
// 별명·종류 같은 글자는 보내지 않는다.

/** 단계 이벤트 하나를 남긴다. */
export function track(name) {
  if (typeof window.clarity === 'function') window.clarity('event', name);
}

/** 이 방문에 태그를 붙인다(예: 결과 상태). */
export function tag(key, value) {
  if (typeof window.clarity === 'function' && value != null) window.clarity('set', key, String(value));
}

/* ---------- 진단 단계: 열림 · 이전/다음 누름 · 머문 시간 구간 ---------- */
// 시간 구간(requirements.md "사용 데이터 (Clarity)", 11/26 결정)
const TIME_BUCKETS = [[10, '0_10s'], [30, '10_30s'], [60, '30_60s'], [Infinity, '60s_plus']];
let shown = null; // { step, at }

/** 진단 단계 화면이 열릴 때 부른다. */
export function stepView(step) {
  shown = { step, at: performance.now() };
  track(`step_view_${step}`);
}

/** 이전('prev')·다음('next') 질문을 눌러 그 단계를 떠날 때 부른다. */
export function stepLeave(step, dir) {
  track(`step_${dir}_${step}`);
  if (shown && shown.step === step) {
    track(`step_time_${step}_${bucketSince(shown.at)}`);
  }
  shown = null;
}

function bucketSince(at) {
  const sec = (performance.now() - at) / 1000;
  return TIME_BUCKETS.find(([max]) => sec < max)[1];
}

/* ---------- 진단 횟수: 한 번 방문(탭을 닫기 전까지) 동안 몇 번째 진단인지 ---------- */
const COUNT_KEY = 'plant-app.diagnoseCount';

/** 진단을 시작할 때 부른다. diagnose_start와 몇 번째인지(1 / 2 / 3plus)를 남긴다. */
export function trackDiagnoseStart() {
  track('diagnose_start');
  let n = 1;
  try {
    n = Number(sessionStorage.getItem(COUNT_KEY) || 0) + 1;
    sessionStorage.setItem(COUNT_KEY, String(n));
  } catch { /* 저장을 못 하면 첫 진단으로 센다 */ }
  track(`diagnose_count_${n >= 3 ? '3plus' : n}`);
}

/* ---------- 결과 화면에 머문 시간 구간 ---------- */
let resultShownAt = null;

/** 결과 화면이 열릴 때 부른다. */
export function resultView() {
  resultShownAt = performance.now();
}

/** 결과 화면을 떠날 때(다른 화면으로 가거나 창을 닫을 때) 부른다. 결과 화면이 아니었으면 아무것도 안 한다. */
export function resultLeave() {
  if (resultShownAt == null) return;
  track(`result_time_${bucketSince(resultShownAt)}`);
  resultShownAt = null;
}
