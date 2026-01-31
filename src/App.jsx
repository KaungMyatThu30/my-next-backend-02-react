import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Items } from "./Items"; // Make sure this path matches where you saved Items.js
import { ItemDetail } from "./ItemDetail"; // Make sure this path matches where you saved ItemDetail.js

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This tells React to show the Items component on the home page */}
        <Route path="/" element={<Items />} />

        {/* This handles the "Edit" link for specific items */}
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
