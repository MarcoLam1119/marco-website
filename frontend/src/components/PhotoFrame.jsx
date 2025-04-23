export default function PhotoFrame(props) {
  return (
    <photoframe className="photo-frame" >
      <img src={props.src}/>
    </photoframe>
  );
}