// symptoms.md를 읽어 증상 목록, 추가 질문, 질문 순서 조건, 상태 단계를 만든다.
// 화면에 보이는 글(증상 이름, 질문, 답, 안내)은 모두 symptoms.md에서 가져온다.
import { loadMd, section, tables } from './md.js';

let data = null;

const unbold = (s) => s.replace(/\*\*/g, '').trim();
const listItems = (text) => text.split('\n').filter((l) => /^\s*-\s+/.test(l)).map((l) => l.replace(/^\s*-\s+/, '').trim());

/** "질문: **...**" 줄과 "안내 문구: ..." 줄, "- 답: 설명" 목록을 읽는다. */
function readQuestion(text) {
  const title = unbold((text.match(/^질문:\s*(.+?)(\s*\(|$)/m) || [])[1] || '');
  const guide = ((text.match(/^안내 문구:\s*(.+)$/m) || [])[1] || '').trim();
  const answers = listItems(text).map((item) => {
    const [label, ...rest] = item.split(/:\s*/);
    return { label: label.trim(), desc: rest.join(': ').trim() };
  });
  return { title, guide, answers };
}

export async function loadSymptoms() {
  if (data) return data;
  const md = await loadMd('symptoms.md');

  // 증상 목록 맨 아래에 항상 보여주는 선택지 ("여기에 없어요")
  const notHere = (section(md, '쓰는 법').match(/맨 아래에\s*"([^"]+)"/) || [])[1];

  // 부위: 표가 있는 부위만 보여준다 ("(작성 예정)"은 숨김)
  const listMd = section(md, '증상 목록');
  const parts = [];
  for (const m of listMd.matchAll(/^###\s*부위:\s*(.+)$/gm)) {
    const name = m[1].trim();
    const table = tables(section(listMd, `부위: ${name}`))[0];
    if (!table) continue;
    parts.push({
      name,
      symptoms: table.rows.map((r) => ({
        name: r['증상 이름'],
        extra: r['추가 질문과 답'] || '',
        levels: parseLevels(r['상태 단계'] || ''),
      })),
    });
  }

  // 흙 상태 질문
  const soilHeading = md.match(/^##\s*(흙 상태 질문.*)$/m)[1].trim();
  const soil = readQuestion(section(md, soilHeading));

  // 최근 변화 질문: 제목 괄호 안의 조건도 읽는다
  const changeHeadingLine = md.match(/^##\s*(최근 변화 질문.*)$/m)[1].trim();
  const changeText = section(md, changeHeadingLine);
  const change = readQuestion(changeText);
  const condText = (changeHeadingLine.match(/\(([^)]*)\)/) || [])[1] || '';
  const conds = condText.replace(/일 때만$/, '').split('+').map((s) => s.trim());
  // 예: [잎이 노래요, 여러 장, 흙이 보통이에요, 진단에서 고른 햇빛 정도가 밝아요/보통]
  const changeRule = {
    symptom: conds[0],
    count: conds[1],
    soil: (conds[2] || '').replace(/^흙이\s*/, ''),
    lights: ((conds[3] || '').split('정도가')[1] || '').split('/').map((s) => s.trim()).filter(Boolean),
    skipPlant: (changeText.match(/^(\S+?)[는은] 이 질문을 하지 않고/m) || [])[1] || null,
  };

  data = { notHere, parts, soil, change, changeRule };
  return data;
}

/**
 * "맨 아래 한두 장: 괜찮아요 / 여러 장: 도움이 필요해요" 또는 "도움이 필요해요"
 * → [{ when: '맨 아래 한두 장', level: '괜찮아요' }, ...]
 */
function parseLevels(cell) {
  return cell.split('/').map((s) => s.trim()).filter(Boolean).map((s) => {
    const i = s.lastIndexOf(':');
    return i < 0 ? { when: null, level: s } : { when: s.slice(0, i).trim(), level: s.slice(i + 1).trim() };
  });
}

/** 증상의 "추가 질문과 답" 칸에서 증상만의 첫 질문(예: 노란 잎이 몇 장인가요?)을 읽는다. */
export function ownQuestion(symptom) {
  const m = symptom.extra.match(/①\s*([^(]+?\?)\s*\(([^)]+)\)/);
  if (!m) return null;
  return {
    title: m[1].trim(),
    guide: '',
    answers: m[2].split('/').map((s) => ({ label: s.trim(), desc: '' })),
  };
}

/** "② "여러 장"일 때만: 흙 상태 질문" → '여러 장' (조건 없이 흙 상태 질문만 있으면 null) */
export function soilOnlyWhen(symptom) {
  const m = symptom.extra.match(/"([^"]+)"일 때만:\s*흙 상태 질문/);
  return m ? m[1] : null;
}

export function asksSoil(symptom) {
  return /흙 상태 질문/.test(symptom.extra);
}

export function asksChange(symptom) {
  return /최근 변화 질문/.test(symptom.extra);
}

export function getSymptoms() {
  return data;
}
