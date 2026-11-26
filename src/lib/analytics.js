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
    const sec = (performance.now() - shown.at) / 1000;
    const [, bucket] = TIME_BUCKETS.find(([max]) => sec < max);
    track(`step_time_${step}_${bucket}`);
  }
  shown = null;
}
