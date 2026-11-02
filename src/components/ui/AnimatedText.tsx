export function AnimatedText({ text, accent }: { text: string; accent?: string }) {
  const letters = Array.from(text);
  const accentStart = accent ? text.indexOf(accent) : -1;

  return <span className="animated-text" aria-label={text}>
    <span aria-hidden="true">{letters.map((letter, index) => <span className={`animated-text__letter${accentStart >= 0 && index >= accentStart ? " animated-text__letter--accent" : ""}`} style={{ animationDelay: `${index * 28}ms` }} key={index}>{letter}</span>)}</span>
  </span>;
}
