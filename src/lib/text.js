// 화면 글자 도구: 안전하게 넣기, 별명 줄이기, 조사 고르기, ui-text.md 문구 채우기.
import { getContent } from '../content/content.js';

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** 홈 선반·편집처럼 칸이 좁은 곳: 5글자가 넘으면 앞 5글자 + "…" */
export function shortName(nickname) {
  const chars = Array.from(nickname);
  return chars.length > 5 ? `${chars.slice(0, 5).join('')}…` : nickname;
}

// 받침 없는 쪽 조사 → [받침 있을 때, 받침 없을 때]
const PAIRS = { '는': ['은', '는'], '를': ['을', '를'], '가': ['이', '가'] };

/** 별명 마지막 글자 받침에 맞춰 조사를 고른다. 한글이 아니면 "을(를)"처럼 둘 다 쓴다. */
export function josa(word, particle) {
  const pair = PAIRS[particle];
  if (!pair) return particle;
  const last = Array.from(word).pop() || '';
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return `${pair[0]}(${pair[1]})`;
  return code % 28 === 0 ? pair[1] : pair[0];
}

/**
 * ui-text.md의 문구를 HTML로 만든다.
 * - {별명}: 별명으로 바꾸고, 바로 뒤의 조사(는/를/가)를 받침에 맞게 고친다.
 * - **단어**: 포인트 초록 강조
 * - 그 밖의 {이름}: vars에서 채운다.
 */
export function t(key, vars = {}) {
  const raw = getContent().ui[key];
  if (raw == null) {
    console.warn(`ui-text.md에 "${key}" 문구가 없어요`);
    return '';
  }
  return format(raw, vars);
}

/** md에서 읽은 아무 문구나 같은 규칙({별명}, **강조**)으로 HTML로 만든다. */
export function format(raw, vars = {}) {
  let html = esc(raw);
  if (vars.nickname != null) {
    html = html.replace(/\{별명\}(\*\*)?(는|를|가)?/g, (_, bold = '', p = '') =>
      `${esc(vars.nickname)}${bold}${p ? josa(vars.nickname, p) : ''}`);
  }
  html = html.replace(/\{([^}]+)\}/g, (m, name) => (vars[name] != null ? esc(vars[name]) : m));
  html = html.replace(/\*\*(.+?)\*\*/g, '<em class="accent">$1</em>');
  return html;
}

/** 강조 없이 글자만 (placeholder, title 같은 속성용) */
export function tPlain(key, vars = {}) {
  const div = document.createElement('div');
  div.innerHTML = t(key, vars);
  return div.textContent;
}
