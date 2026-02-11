import React, { useState } from "react";
import axios from "axios";

interface Item {
  id: string;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
}

interface OrderResponse {
  orderId: string;
  status: string;
  total?: number;
  reason?: string;
}

const OrderForm: React.FC = () => {
  const [customer, setCustomer] = useState<Customer>({ name: "", email: "" });
  const [items, setItems] = useState<Item[]>([{ id: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  const newItems = [...items];

  if (name === "id") {
    newItems[index].id = value;
  } else if (name === "quantity") {
    newItems[index].quantity = Number(value);
  }

  setItems(newItems);
};


  const addItem = () => {
    setItems([...items, { id: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError("");

    try {
      const res = await axios.post<OrderResponse>("http://localhost:3001/api/orders", {
        customer,
        items,
      });

      setResponse(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.reason || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 20, background: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleCustomerChange}
            style={{ width: "100%", padding: 8, margin: "5px 0" }}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleCustomerChange}
            style={{ width: "100%", padding: 8, margin: "5px 0" }}
            required
          />
        </div>
        <div>
          <h4>Items: NOTE: list of item: item_1, item_2, item_3,item_4</h4>
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input
                type="text"
                name="id"
                placeholder="Item ID"
                value={item.id}
                onChange={(e) => handleItemChange(index, e)}
                style={{ flex: 2, padding: 8 }}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                style={{ flex: 1, padding: 8 }}
                min={1}
                required
              />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} style={{ flex: 0.5 }}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} style={{ marginTop: 10 }}>
            Add Item
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 20, padding: 10, width: "100%", background: "#007BFF", color: "#fff", border: "none" }}
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: 20, padding: 10, background: "#D4EDDA", color: "#155724" }}>
          <p>Order ID: {response.orderId}</p>
          <p>Status: {response.status}</p>
          {response.total && <p>Total: {response.total}</p>}
          {response.reason && <p>Reason: {response.reason}</p>}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, padding: 10, background: "#F8D7DA", color: "#721C24" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default OrderForm;
