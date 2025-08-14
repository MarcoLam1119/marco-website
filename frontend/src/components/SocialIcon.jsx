export function SocialIcon(props) {
  return (
    <a href={props.url} style={{ display: 'flex',  gap: '10px' }}>
      <img src={`/src/assets/icon/${props.social}_Original.svg`} alt={`${props.social} icon`} />
      <span style={{ color: 'var(--text)'}}>{props.text}</span>
    </a>
  );
}