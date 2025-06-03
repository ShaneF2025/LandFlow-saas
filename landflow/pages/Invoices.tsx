// pages/Invoices.tsx
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-project-id.supabase.co";
const supabaseKey = "public-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Invoice {
  id: number;
  client: string;
  amount: number;
  date: string;
  status: "Paid" | "Unpaid";
}

export const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [user, setUser] = useState<any>(null);
  const [newInvoice, setNewInvoice] = useState({ client: "", amount: "", date: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date_desc");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, client, amount, date, status")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching invoices:", error.message);
      } else {
        setInvoices(data);
      }
    };
    fetchInvoices();
  }, [user]);

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${invoice.client}`, 20, 40);
    doc.text(`Amount: $${invoice.amount.toFixed(2)}`, 20, 50);
    doc.text(`Date: ${invoice.date}`, 20, 60);
    doc.text(`Status: ${invoice.status}`, 20, 70);
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  const markAsPaid = async (id: number) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "Paid" })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to update invoice status:", error.message);
      return;
    }

    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: "Paid" } : inv));
  };

  const sendStripeLink = (client: string, amount: number) => {
    const url = `https://buy.stripe.com/test_xyz?client=${encodeURIComponent(client)}&amount=${amount}`;
    window.open(url, '_blank');
  };

  const createInvoice = async () => {
    const { client, amount, date } = newInvoice;
    if (!client || !amount || !date) return alert("All fields are required");

    const { data, error } = await supabase.from("invoices").insert([
      {
        client,
        amount: parseFloat(amount),
        date,
        status: "Unpaid",
        user_id: user.id
      }
    ]).select();

    if (error) {
      console.error("Error creating invoice:", error.message);
      return;
    }

    setInvoices([...invoices, data[0]]);
    setNewInvoice({ client: "", amount: "", date: "" });
  };

  const saveEdit = async (id: number, updatedInvoice: Partial<Invoice>) => {
    const { data, error } = await supabase
      .from("invoices")
      .update(updatedInvoice)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Error updating invoice:", error.message);
      return;
    }

    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updatedInvoice } as Invoice : inv));
    setEditingId(null);
  };

  const deleteInvoice = async (id: number) => {
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting invoice:", error.message);
      return;
    }

    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    switch (sort) {
      case "amount_asc": return a.amount - b.amount;
      case "amount_desc": return b.amount - a.amount;
      case "date_asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date_desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
      default: return 0;
    }
  });

  const filteredInvoices = filter === "all"
    ? sortedInvoices
    : sortedInvoices.filter(inv => inv.status.toLowerCase() === filter);

  if (!user) {
    return <div className="text-center p-8">Loading authentication...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <span className="text-sm text-gray-600">Signed in as {user.email}</span>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <label>Sort by:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
          <option value="date_desc">Date (Newest)</option>
          <option value="date_asc">Date (Oldest)</option>
          <option value="amount_desc">Amount (High to Low)</option>
          <option value="amount_asc">Amount (Low to High)</option>
        </select>
      </div>

      <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Create New Invoice</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Client"
            value={newInvoice.client}
            onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={newInvoice.date}
            onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={createInvoice}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Invoice
          </button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No invoices found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead className="bg-yellow-100">
              <tr>
                <th className="text-left p-2">Client</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-t">
                  <td className="p-2">
                    {editingId === invoice.id ? (
                      <input
                        type="text"
                        value={invoice.client}
                        onChange={(e) => setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, client: e.target.value } : i))}
                        className="border p-1 rounded"
                      />
                    ) : (
                      invoice.client
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === invoice.id ? (
                      <input
                        type="number"
                        value={invoice.amount}
                        onChange={(e) => setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, amount: parseFloat(e.target.value) } : i))}
                        className="border p-1 rounded"
                      />
                    ) : (
                      `$${invoice.amount.toFixed(2)}`
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === invoice.id ? (
                      <input
                        type="date"
                        value={invoice.date}
                        onChange={(e) => setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, date: e.target.value } : i))}
                        className="border p-1 rounded"
                      />
                    ) : (
                      invoice.date
                    )}
                  </td>
                  <td className="p-2">{invoice.status}</td>
                  <td className="p-2 flex flex-wrap gap-1">
                    <button
                      className="text-sm text-blue-700 hover:underline"
                      onClick={() => generatePDF(invoice)}
                    >
                      PDF
                    </button>
                    <button
                      className="text-sm text-green-700 hover:underline"
                      onClick={() => markAsPaid(invoice.id)}
                    >
                      Mark Paid
                    </button>
                    <button
                      className="text-sm text-purple-700 hover:underline"
                      onClick={() => sendStripeLink(invoice.client, invoice.amount)}
                    >
                      Send Link
                    </button>
                    {editingId === invoice.id ? (
                      <button
                        className="text-sm text-red-700 hover:underline"
                        onClick={() => saveEdit(invoice.id, invoice)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="text-sm text-gray-700 hover:underline"
                        onClick={() => setEditingId(invoice.id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => deleteInvoice(invoice.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
