import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItem() {
    try {
      const response = await fetch(`http://localhost:3000/api/item/${id}`);
      if (!response.ok) return;
      const data = await response.json();

      if (itemNameRef.current) itemNameRef.current.value = data.itemName || "";
      if (itemCategoryRef.current)
        itemCategoryRef.current.value = data.itemCategory || "";
      if (itemPriceRef.current)
        itemPriceRef.current.value = data.itemPrice || "";
    } catch (error) {
      console.error("Failed to load item", error);
    }
  }

  async function onSave() {
    const body = {
      name: itemNameRef.current.value,
      category: itemCategoryRef.current.value,
      price: itemPriceRef.current.value,
    };

    await fetch(`http://localhost:3000/api/item/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    navigate("/"); // Go back to list
  }

  useEffect(() => {
    loadItem();
  }, []);

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h3>Edit Item</h3>

        <label>Item Name</label>
        <input type="text" ref={itemNameRef} className="form-input" />

        <label>Category</label>
        <select ref={itemCategoryRef} className="form-input">
          <option value="Stationary">Stationary</option>
          <option value="Kitchenware">Kitchenware</option>
          <option value="Appliance">Appliance</option>
        </select>

        <label>Price ($)</label>
        <input type="number" ref={itemPriceRef} className="form-input" />

        <div className="button-group">
          <button onClick={onSave} className="btn-save">
            Save Changes
          </button>
          <button onClick={() => navigate("/")} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
