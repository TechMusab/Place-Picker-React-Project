import { useRef, useState,useEffect } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import { sortPlacesByDistance } from "./loc.js";
import logoImg from "./assets/logo.png";

function App() {
  const modalref = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState([]);
  const [availableplaces, setavailableplaces] = useState([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const places = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setavailableplaces(places);
    });
  }, []);

  function handleStartRemovePlace(id) {
    modalref.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modalref.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
  }
  
  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modalref.current.close();
  }

  return (
    <>
      <Modal ref={modalref}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availableplaces}
          fallbackText="Looking for Places..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
