import { useEffect, useState } from "react";
import ContainerGrid from "../components/ContainerGrid";
import PhotoFrame from "../components/PhotoFrame";
import FixedRightBottom from "../components/FixedRightBottom";
import PhotoAnimation from '../components/PhotoAnimation';
import TokenCheck from "../components/tokenCheck";
import PopupForm from "../components/PopupForm"

export default function PhotoLibrary() {
  const [photos, setPhotos] = useState([]);
  const [inputedName, setInputedName] = useState(null);
  const [inputedCategory, setInputedCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${window.location.protocol}//${window.location.hostname}:9090/photos/list`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const addPhotoHandler = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('name', inputedName);
    formData.append('category_id', '1');
    formData.append('file', selectedFile, selectedFile.name);

    setIsLoading(true);
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:9090/photos/add`, {
        method: 'POST',
        body: formData,
        headers: {
          'accept': 'application/json',
          // Note: Do NOT set 'Content-Type' for FormData; the browser will set it correctly.
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add photo");
      }

      // Refresh photos after adding
      const newPhoto = await response.json();
      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
    } catch (error) {
      console.error("Error adding photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main id="photo-library">
      <h1>Photo Library</h1>
      <p>Welcome to my photo library! Here are some of my favorite photos:</p>
      <TokenCheck>
        <button className="btn-3d" onClick={() => setShowPopup(true)}>Add Photo</button>
      </TokenCheck>
      <PopupForm show={showPopup} onClose={() => setShowPopup(false)}>
          <input placeholder="name" onChange={(e) => setInputedName(e.target.value)}/>
          <input placeholder="category" onChange={(e) => setInputedCategory(e.target.value)}/>
          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
          />
          <button className="btn-3d" onClick={addPhotoHandler} disabled={isLoading}>
            {isLoading ? "Adding Photo..." : "Add Photo"}
          </button>
        
      </PopupForm>
      {isLoading && <p>Loading photos...</p>}
      <ContainerGrid>
        {photos.map(photo => (
          <PhotoAnimation 
            key={photo.id} 
            imageUrl={`${window.location.origin}/${photo.upload_location}`} 
            altText=""
          />
        ))}
      </ContainerGrid>
    </main>
  );
}