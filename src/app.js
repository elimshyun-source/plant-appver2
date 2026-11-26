// 시작과 화면 이동. 주소의 # 뒤를 보고 화면을 고른다.
import { loadContent } from './content/content.js';
import { renderHome } from './screens/home.js';
import { renderDelete } from './screens/delete.js';
import { renderRegister, resetRegisterDraft } from './screens/register.js';
import { renderSymptoms } from './screens/symptoms.js';
import { renderQuestion } from './screens/question.js';
import { renderResult, renderDeadend } from './screens/result.js';
import { loadSymptoms } from './content/symptoms.js';
import { loadSolutions } from './content/solutions.js';
import { startFlow } from './flow.js';
import { tPlain } from './lib/text.js';
import { track, trackDiagnoseStart, resultLeave } from './lib/analytics.js';

const root = document.getElementById('app');
let previous = null;

function route() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [page, arg] = parts;

  resultLeave(); // 결과 화면을 떠나면 머문 시간 구간을 남긴다(결과 화면이 아니었으면 아무것도 안 함)
  window.scrollTo(0, 0);
  document.body.classList.remove('bg-soft'); // 해결책 화면만 연한 배경

  if (!page) renderHome(root);
  else if (page === 'delete') renderDelete(root, arg);
  else if (page === 'register') {
    const step = Number(arg) || 1;
    // 홈에서 더하기를 눌러 새로 시작할 때만 지난 입력을 비운다.
    if (step === 1 && (previous === null || previous === '')) { resetRegisterDraft(); track('register_start'); }
    renderRegister(root, Math.min(Math.max(step, 1), 2));
  } else if (page === 'plant' && arg) {
    const [, , sub, n] = parts;
    if (!sub) {
      // 홈에서 식물을 누르면 증상을 새로 고른다(requirements.md 1. 홈).
      if (previous === '') { startFlow(arg); trackDiagnoseStart(); }
      renderSymptoms(root, arg);
    } else if (sub === 'q') {
      renderQuestion(root, arg, Number(n) || 0);
    } else if (sub === 'result') {
      renderResult(root, arg);
    } else if (sub === 'deadend') {
      renderDeadend(root, arg);
    } else {
      location.replace('#/');
      return;
    }
  } else {
    location.replace('#/');
    return;
  }
  previous = page || '';
}

async function start() {
  try {
    await Promise.all([loadContent(), loadSymptoms(), loadSolutions()]);
  } catch (err) {
    // md 파일을 읽지 못하면(파일을 바로 열었을 때 등) 화면 문구도 읽을 수 없어서,
    // 화면에 글을 지어 쓰지 않고 이유는 개발자 도구(콘솔)에만 남긴다.
    console.error('[plant-app] md 파일을 읽지 못했어요. 미리보기 서버(scripts/serve.mjs)로 열어 주세요.', err);
    return;
  }
  document.title = tPlain('home.title');
  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', resultLeave); // 결과 화면에서 창을 닫을 때
  route();
}

start();
