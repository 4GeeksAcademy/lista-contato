// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store"

// Import the reducer and the initial state.
const StoreContext = createContext(null);
// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const API = "https://playground.4geeks.com/contact";
const AGENDA = "sarah";

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    // Provide the store and dispatch method to all child components.
    const actions = {
        createAgenda: async () => {
            const resp = await fetch(`${API}/agendas/${AGENDA}`, { method: "POST" });
            return resp.ok;
        },

        getContacts: async () => {
            const resp = await fetch(`${API}/agendas/${AGENDA}/contacts`);

            if (!resp.ok) {
                const created = await actions.createAgenda();
                if (created) return actions.getContacts();
                return false;
            }

            const data = await resp.json();
            dispatch({ type: "set_contacts", payload: data.contacts || [] });
        },

        addContact: async (contact) => {
            const payload = {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                address: contact.address,
                agenda_slug: AGENDA
            };

            const resp = await fetch(`${API}/agendas/${AGENDA}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) return false;
            await actions.getContacts();
            return true;
        },

        updateContact: async (id, contact) => {
            const payload = {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                address: contact.address,
                agenda_slug: AGENDA
            };

            const resp = await fetch(`${API}/agendas/${AGENDA}/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) return false;
            await actions.getContacts();
            return true;
        },

        deleteContact: async (id) => {
            const resp = await fetch(`${API}/agendas/${AGENDA}/contacts/${id}`,
                { method: "DELETE", });

            if (!resp.ok) return false;
            await actions.getContacts();
            return true;
        }
    };


    return (
        <StoreContext.Provider value={{ store, dispatch, actions }}>
            {children}
        </StoreContext.Provider>);
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useGlobalReducer needs to be inside of <StoreProvider>.");
    }
    return context;
}