import { useRef, useState, useEffect } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import { sortPlacesByDistance } from "./loc.js";
import logoImg from "./assets/logo.png";
const storedids = JSON.parse(localStorage.getItem("selectedPlace")) || [];
const storedplaces = storedids.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);
function App() {
  const selectedPlace = useRef();
  const [open, setopen] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState(storedplaces);
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
    setopen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setopen(false);
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
    const storedIds = JSON.parse(localStorage.getItem("selectedPlace")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem("selectedPlace", JSON.stringify([id, ...storedIds]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setopen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlace"));
    const updatedIds = storedIds.filter((id) => id !== selectedPlace.current);
    localStorage.setItem("selectedPlace", JSON.stringify(updatedIds));
  }

  return (
    <>
      <Modal open={open}>
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
