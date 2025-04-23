import ContainerGrid from "../components/ContainerGrid"
import PhotoFrame from "../components/PhotoFrame";
import FixedRightBottom from "../components/FixedRightBottom";

export default function PhotoLibrary() {
  return (
    <>
      <h1>Photo Library</h1>
      <p>Welcome to my photo library! Here are some of my favorite photos:</p>
      <ContainerGrid>
        <PhotoFrame src="https://via.placeholder.com/150"/>
        <PhotoFrame src="https://via.placeholder.com/150"/>
        <PhotoFrame src="https://via.placeholder.com/150"/>
        <PhotoFrame src="https://via.placeholder.com/150"/>
      </ContainerGrid>
      <FixedRightBottom/>
    </>
  );
}