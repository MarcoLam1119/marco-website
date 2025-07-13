

export default function PhotoFrame(props) {
  return (
    <photo-frame className="photo-frame" >
      <img src={props.src}/>
    </photo-frame>
  );
}