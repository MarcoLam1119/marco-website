import { useEffect, useState } from "react";
import ContainerGrid from "../components/ContainerGrid";
import PhotoFrame from "../components/PhotoFrame";
import FixedRightBottom from "../components/FixedRightBottom";
import { gsap } from "gsap"

export default function PhotoLibrary() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("http://homepc.marco-lam-web.net:9090/photos/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div id="photo-library">
      <h1>Photo Library</h1>
      <p>Welcome to my photo library! Here are some of my favorite photos:</p>
      <FixedRightBottom />
      <ContainerGrid>
        {photos.map(photo => (
          <PhotoFrame key={photo.id} src={"http://homepc.marco-lam-web.net/"+photo.upload_location} />
        ))}
      </ContainerGrid>
    </div>
  );
}