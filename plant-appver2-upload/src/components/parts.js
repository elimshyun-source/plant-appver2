// 공통 부품: 화분, 식물 그림, 아이콘, 상태 표시.
import { getContent } from '../content/content.js';
import { esc, t } from '../lib/text.js';

/**
 * 빨간 화분: 홈 창문 그림 속 화분과 같은 모양·색(테두리 #FD6050, 몸통 #CC2424, 검은 외곽선).
 * 단위는 외곽선을 포함한 테두리 너비 254, 높이 230 (창문 그림 속 화분을 잰 값).
 */
export const POT_UNITS = { w: 254, h: 230, rimTop: 3.5 };
export function pot() {
  return `<svg class="pot" viewBox="0 0 ${POT_UNITS.w} ${POT_UNITS.h}" aria-hidden="true">
    <path d="M21.5 59.5 L232.5 59.5 L210.5 225.5 L43.5 225.5 Z" fill="var(--color-pot-body)" stroke="var(--color-pot-line)" stroke-width="7" stroke-linejoin="round"/>
    <rect x="3.5" y="3.5" width="247" height="52" rx="2" fill="var(--color-pot-rim)" stroke="var(--color-pot-line)" stroke-width="7"/>
  </svg>`;
}

/** 그림 번호 → plants.md "식물 그림" 표의 한 줄 */
export function artOf(no) {
  const arts = getContent().art;
  return arts.find((a) => a.no === no) || arts[0] || null;
}

/**
 * 화분 + 식물 그림 (결과 화면). rimPx = 화면에서 화분 테두리 너비.
 * 식물 그림 아랫면은 화분 테두리 윗면(외곽선 가운데)에 맞춘다.
 */
export function potWithPlant(artNo, rimPx) {
  const art = artOf(artNo);
  const overlap = (POT_UNITS.rimTop / POT_UNITS.w) * rimPx;
  const img = art ? `<img class="plant-art" src="${esc(art.file)}" alt="" draggable="false" style="width:${art.width * 100}%">` : '';
  return `<div class="pot-plant" style="width:${rimPx}px; --overlap:${overlap}px">${img}${pot()}</div>`;
}

export const icons = {
  gear: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  check: `<svg class="check" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 10.5 L8.5 14.5 L15.5 6"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 16 16" stroke="var(--color-ink)" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 1 V15 M1 8 H15"/></svg>`,
};

/** 상태 표시: 점 + 글자. 상태가 없으면 아무것도 그리지 않는다. */
export function statusBadge(status) {
  if (status !== 'ok' && status !== 'help') return '';
  const key = status === 'ok' ? 'status.ok' : 'status.help';
  return `<span class="status"><span class="dot ${status}" aria-hidden="true"></span><span class="t-desc">${t(key)}</span></span>`;
}
