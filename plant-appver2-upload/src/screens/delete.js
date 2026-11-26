// 삭제 확인: "{별명}을(를) 삭제할까요?" / 취소·삭제
import { findPlant, removePlant } from '../store.js';
import { t } from '../lib/text.js';

export function renderDelete(root, id) {
  const plant = findPlant(id);
  if (!plant) { location.replace('#/'); return; }

  root.innerHTML = `
    <section class="delete">
      <div class="screen-head">
        <h1 class="t-title" data-clarity-mask="true">${t('delete.title', { nickname: plant.nickname })}</h1>
        <p class="t-desc">${t('delete.guide')}</p>
      </div>
      <div class="bottom-bar">
        <a class="btn btn-secondary" href="#/">${t('delete.cancel')}</a>
        <button class="btn btn-primary" type="button" data-confirm>${t('delete.confirm')}</button>
      </div>
    </section>`;

  root.querySelector('[data-confirm]').addEventListener('click', () => {
    removePlant(id);
    location.replace('#/');
  });
}
