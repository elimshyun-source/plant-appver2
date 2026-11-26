// md 파일을 읽어 표(table)를 꺼내는 도구.
// 앱은 문구·식물 정보를 코드에 쓰지 않고 이 도구로 md에서 읽는다.

const cache = new Map();

export async function loadMd(path) {
  if (!cache.has(path)) {
    // md를 고치고 새로고침하면 바로 반영되도록 캐시를 쓰지 않는다.
    cache.set(path, fetch(path, { cache: 'no-store' }).then((res) => {
      if (!res.ok) throw new Error(`${path}를 읽지 못했어요 (${res.status})`);
      return res.text();
    }));
  }
  return cache.get(path);
}

/** "## 제목" 아래(다음 같은 수준 제목 전까지)의 글을 돌려준다. */
export function section(md, heading) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => l.replace(/^#+\s*/, '').trim() === heading && /^#+\s/.test(l));
  if (start < 0) return '';
  const level = lines[start].match(/^#+/)[0].length;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+)\s/);
    if (m && m[1].length <= level) break;
    out.push(lines[i]);
  }
  return out.join('\n');
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

/**
 * 글 안의 표들을 읽는다. 각 표는 { header: [...], rows: [{열이름: 값}] }.
 */
export function tables(text) {
  const lines = text.split('\n');
  const result = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
      const header = splitRow(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = splitRow(lines[i]);
        const row = {};
        header.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
        rows.push(row);
        i++;
      }
      result.push({ header, rows });
    } else {
      i++;
    }
  }
  return result;
}

/** [확인됨] / [초안] 같은 표시를 떼어 낸다. */
export function stripMarks(value) {
  return value.replace(/\s*\[[^\]]*\]\s*/g, ' ').trim();
}
