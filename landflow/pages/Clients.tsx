// pages/Clients.tsx
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([{
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    address: "123 Green St."
  }]);

  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = () => {
    setClients([...clients, { ...newClient, id: Date.now() }]);
    setNewClient({ id: 0, name: "", email: "", phone: "", address: "" });
    setShowModal(false);
  };

  const handleDeleteClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle className="w-5 h-5" /> Add Client
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-green-100">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">Address</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-t">
              <td className="p-2">{client.name}</td>
              <td className="p-2">{client.email}</td>
              <td className="p-2">{client.phone}</td>
              <td className="p-2">{client.address}</td>
              <td className="p-2">
                <button className="text-sm text-green-700 hover:underline mr-2">Edit</button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={newClient.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone"
              value={newClient.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={newClient.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClient}
                className="px-4 py-2 bg-green-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
