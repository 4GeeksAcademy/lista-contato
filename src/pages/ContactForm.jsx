import { func } from "prop-types";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { act } from "react";

export default function ContactForm() {
  const navigate = useNavigate();
  const params = useParams();
  const { store, actions } = useGlobalReducer();

  const isEdit = Boolean(params.id);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (isEdit && store.contacts.length === 0) {
      actions.getContacts();
    }
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const idNum = Number(params.id);
    const found = store.contacts.find((c) => c.id === idNum);

    if (found) {
      setContact({
        name: found.name || "",
        email: found.email || "",
        phone: found.phone || "",
        address: found.address || ""
      });
    }
  }, [store.contacts, params.id]);


  function handleChange(e) {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let ok = false;


    if (isEdit) {
      ok = await actions.updateContact(params.id, contact);
    } else {
      ok = await actions.addContact(contact);
    }

    if (!ok) {

      alert("Error: Check your data again.");
      return;
    }

    navigate("/");
  }

  return (
    <>
      <div className="container py-4">
        <h1 className="text-center mb-4">Add a new contact</h1>

        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 950 }}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control"
              name="name"
              value={contact.name} onChange={handleChange} placeholder="Full Name" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control"
              name="email"
              value={contact.email} onChange={handleChange} placeholder="Enter e-mail" type="Email" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              placeholder="Enter phone"
            />
          </div>


          <div className="mb-4">
            <label className="form-label">Address</label>
            <input className="form-control"
              name="address"
              value={contact.address} onChange={handleChange} placeholder="Enter address" />
          </div>
          <button className="btn btn-pink w-100" type="submit">Save</button>

          <div className="mt-2">
            <Link to="/" className="text-decoration-underline">or get back to contacts</Link>
          </div>
        </form>
      </div>

    </>

  );
}



