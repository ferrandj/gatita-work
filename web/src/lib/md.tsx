import { Fragment, type ReactNode } from 'react';

/**
 * Tiny Markdown subset for the course text (no HTML, so nothing can be injected):
 * paragraphs, "- " lists, "1. " lists, "> " notes, ``` code blocks, | tables |, **bold**, `code`.
 */

export function inline(text: string, key = 'i'): ReactNode {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0, m: RegExpExecArray | null, n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2] !== undefined) out.push(<strong key={key + n++}>{inline(m[2], key + 'b' + n)}</strong>);
    else out.push(<code key={key + n++}>{m[3]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.length === 1 ? out[0] : <Fragment>{out}</Fragment>;
}

type Block =
  | { t: 'p'; text: string } | { t: 'ul' | 'ol'; items: string[] } | { t: 'note'; text: string }
  | { t: 'code'; text: string } | { t: 'table'; rows: string[][] };

export function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r/g, '').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.trim().startsWith('```')) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) body.push(lines[i++]);
      i++;
      blocks.push({ t: 'code', text: body.join('\n') });
      continue;
    }
    if (line.trim().startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push({ t: 'table', rows });
      continue;
    }
    const ul = /^\s*-\s+(.*)$/, ol = /^\s*\d+\.\s+(.*)$/;
    if (ul.test(line) || ol.test(line)) {
      const re = ul.test(line) ? ul : ol;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push((re.exec(lines[i]) as RegExpExecArray)[1]), i++;
      blocks.push({ t: re === ul ? 'ul' : 'ol', items });
      continue;
    }
    if (line.startsWith('>')) {
      const body: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) body.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push({ t: 'note', text: body.join(' ') });
      continue;
    }
    const body: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(-\s|\d+\.\s|>|```|\|)/.test(lines[i])) body.push(lines[i++]);
    blocks.push({ t: 'p', text: body.join(' ') });
  }
  return blocks;
}

export function Md({ src, className }: { src: string; className?: string }): ReactNode {
  return (
    <div className={'md' + (className ? ' ' + className : '')}>
      {parseBlocks(src).map((b, k) => {
        switch (b.t) {
          case 'p': return <p key={k}>{inline(b.text, 'p' + k)}</p>;
          case 'note': return <p key={k} className="note">💡 {inline(b.text, 'n' + k)}</p>;
          case 'code': return <pre key={k} className="sql"><code>{b.text}</code></pre>;
          case 'ul': return <ul key={k}>{b.items.map((it, j) => <li key={j}>{inline(it, `u${k}-${j}`)}</li>)}</ul>;
          case 'ol': return <ol key={k}>{b.items.map((it, j) => <li key={j}>{inline(it, `o${k}-${j}`)}</li>)}</ol>;
          case 'table': return (
            <div key={k} className="tbl"><table>
              <thead><tr>{b.rows[0].map((c, j) => <th key={j}>{inline(c, `h${k}-${j}`)}</th>)}</tr></thead>
              <tbody>{b.rows.slice(1).map((r, j) => <tr key={j}>{r.map((c, x) => <td key={x}>{inline(c, `t${k}-${j}-${x}`)}</td>)}</tr>)}</tbody>
            </table></div>
          );
        }
      })}
    </div>
  );
}
