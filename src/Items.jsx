import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

export function Items() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Matches video pagination

  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItems() {
    try {
      const response = await fetch("http://localhost:3000/api/item");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function onItemSave() {
    const body = {
      name: itemNameRef.current.value,
      category: itemCategoryRef.current.value,
      price: itemPriceRef.current.value,
    };

    await fetch("http://localhost:3000/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Clear inputs
    itemNameRef.current.value = "";
    itemPriceRef.current.value = "";
    loadItems();
  }

  async function onDelete(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`http://localhost:3000/api/item/${id}`, { method: "DELETE" });
    loadItems();
  }

  useEffect(() => {
    loadItems();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="container">
      <h2>Item Management</h2>
      <table className="item-table">
        <colgroup>
          {/* This fixes column widths so they don't jump around */}
          <col style={{ width: "30%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>${item.itemPrice}</td>
              <td>
                <span className="status-active">{item.status || "ACTIVE"}</span>
              </td>
              <td>
                <Link to={`/items/${item._id}`} className="btn-edit">
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(item._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {/* Add Row - Clean inputs */}
          <tr className="add-row">
            <td>
              <input type="text" ref={itemNameRef} placeholder="Enter Name" />
            </td>
            <td>
              <select ref={itemCategoryRef}>
                <option value="Stationary">Stationary</option>
                <option value="Kitchenware">Kitchenware</option>
                <option value="Appliance">Appliance</option>
              </select>
            </td>
            <td>
              <input type="number" ref={itemPriceRef} placeholder="0.00" />
            </td>
            <td></td>
            <td>
              <button onClick={onItemSave} className="btn-add">
                + Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
