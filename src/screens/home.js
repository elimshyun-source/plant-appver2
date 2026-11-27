// 1. 홈 (내 식물): 창문 그림 + 그림 속 화분 하나 + 진단하기 (requirements.md 11/25 변경)
import { getPlant, getHistory } from '../store.js';
import { icons, statusBadge, artOf } from '../components/parts.js';
import { esc, t } from '../lib/text.js';

// 창문 그림(assets/home/window.webp)의 픽셀 크기와, 그림 속 빨간 화분 자리
// rimW = 외곽선 포함 테두리 너비, rimTop = 테두리 윗면 외곽선 가운데
const WINDOW = { src: 'assets/home/window.webp', w: 1418, h: 2000 };
const POT = { cx: 756, top: 1568, rimTop: 1565, rimW: 254 };
// 그림 속 펼친 책(진단 기록으로 가는 곳, 11/27). top = 책 맨 위(왼쪽 책장 끝)
const BOOK = { left: 80, top: 1545, right: 548, bottom: 1795 };

const pctX = (x) => `${(x / WINDOW.w) * 100}%`;
const pctY = (y) => `${(y / WINDOW.h) * 100}%`;

/** 그림 속 화분 위에 올리는 식물 그림(등록할 때 랜덤으로 정한 것, plants.md "식물 그림") */
function plantOnPot(artNo) {
  const art = artOf(artNo);
  if (!art) return '';
  return `<img class="plant-art" src="${esc(art.file)}" alt="" draggable="false"
    style="left:${pctX(POT.cx)}; bottom:${pctY(WINDOW.h - POT.rimTop)}; width:${pctX(POT.rimW * art.width)}">`;
}

export function renderHome(root) {
  const plant = getPlant();
  const gear = plant
    ? `<a class="icon-button" href="#/delete/${esc(plant.id)}" aria-label="${t('a11y.settings')}">${icons.gear}</a>`
    : '';
  const onPot = plant
    ? plantOnPot(plant.art)
    : `<a class="pot-plus" href="#/register/1" style="left:${pctX(POT.cx)}; top:${pctY(POT.top)}" aria-label="${t('a11y.add')}"><span class="circle">${icons.plus}</span></a>`;
  // 책: 식물이 있으면 그림을 눌러 기록으로 간다. 기록이 있으면 위에 "기록" 알약을 띄운다
  const book = plant
    ? `<a class="book-hit" href="#/history" tabindex="-1" aria-hidden="true"
        style="left:${pctX(BOOK.left)}; top:${pctY(BOOK.top)}; width:${pctX(BOOK.right - BOOK.left)}; height:${pctY(BOOK.bottom - BOOK.top)}"></a>
      ${getHistory(plant.id).length ? `<a class="book-pill" href="#/history" style="left:${pctX((BOOK.left + BOOK.right) / 2)}; top:${pctY(BOOK.top)}">${t('home.history')}</a>` : ''}`
    : '';
  const label = plant
    ? `<div class="home-label">
        <p class="t-name" data-clarity-mask="true">${esc(plant.nickname)}</p>
        <p class="t-kind">${esc(plant.kind)}</p>
        ${statusBadge(plant.status)}
      </div>`
    : '';

  root.innerHTML = `
    <section class="home">
      <div class="screen-head">
        <div class="title-row">
          <h1 class="t-title">${t('home.title')}</h1>
          ${gear}
        </div>
      </div>
      <div class="window">
        <img class="window-art" src="${WINDOW.src}" alt="" width="${WINDOW.w}" height="${WINDOW.h}">
        ${onPot}
        ${book}
      </div>
      ${label}
      <div class="bottom-spacer"></div>
      <div class="bottom-bar">
        ${plant
          ? `<a class="btn btn-primary" href="#/plant/${esc(plant.id)}">${t('home.diagnose')}</a>`
          : `<button class="btn btn-primary" type="button" disabled>${t('home.diagnose')}</button>`}
      </div>
    </section>`;
}
