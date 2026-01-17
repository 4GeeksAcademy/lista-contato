import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const ListaDeContactos = () => {
  const { store, actions } = useGlobalReducer();


  useEffect(() => {
    actions.getContacts();
  }, []);

  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVkIneJojcd99LWMxA6r9B2LpOsF38JbWIIQ&s";

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-3">
        <Link to="/contact-form" className="btn btn-pink"> Add new contact</Link>
      </div>

      <div className="border rounded">
        {store.contacts.length === 0 ? (
          <p className="p-3 m-0">No contact yet.</p>
        ) : (
          store.contacts.map((c) => (
            <div
              key={c.id}
              className="d-flex align-items-center justify-content-between p-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={defaultAvatar}
                  alt={c.name || "Contact"}
                  className="rounded-circle"
                  style={{ width: 70, height: 70, objectFit: "cover" }} />
                <div>
                  <h5 className="mb-1">{c.name}</h5>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    <div>📍 {c.address || "-"}</div>
                    <div>📞 {c.phone || "-"}</div>
                    <div>✉️ {c.email || "-"}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link to={`/contact-form/${c.id}`} className="btn btn-link text-dark">✏️</Link>

                <button className="btn btn-link text dark" onClick={() => {
                  const ok = confirm("Are you sure");
                  if (ok) actions.deleteContact(c.id);
                }}
                >🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

};

export default ListaDeContactos;