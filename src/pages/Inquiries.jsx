import React, { useEffect, useState } from "react";

const Inquiries = () => {

  const [contacts, setContacts] = useState([]);

  const fetchContacts = () => {

    fetch("http://localhost:5000/api/contact")
      .then(res => res.json())
      .then(data => setContacts(data));

  };

  useEffect(() => {

    fetchContacts();

  }, []);

  const deleteInquiry = async (id) => {

    if (!window.confirm("Delete this inquiry?")) return;

    await fetch(`http://localhost:5000/api/contact/${id}`, {
      method: "DELETE"
    });

    fetchContacts();

  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Client Inquiries
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-200">

          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Service</th>
            <th className="p-3">Message</th>
            <th className="p-3">Action</th>
          </tr>

        </thead>

        <tbody>

          {contacts.map((item) => (

            <tr key={item._id} className="border-b">

              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.email}</td>
              <td className="p-3">{item.service}</td>
              <td className="p-3">{item.message}</td>

              <td className="p-3">

                <button
                  onClick={() => deleteInquiry(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default Inquiries;