
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";

const API_URL = "https://eventregistration-api.onrender.com/api/events";

const emptyForm = {
  name: "",
  description: "",
  date: "",
  venue: "",
};

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();
const location = useLocation();
const page = location.pathname === "/" ? "dashboard" : "add";
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to load events. Please check your backend and MongoDB connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const totalRegistrations = events.reduce(
    (total, event) => total + (event.registrations || 0),
    0
  );

  const upcomingEvents = events.filter(
    (event) => String(event.date).slice(0, 10) >= today
  ).length;

  const filteredEvents = events.filter((event) =>
    `${event.name} ${event.venue}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
  setForm(emptyForm);
  setEditingId(null);
  navigate("/add-event");
}

 function openEditForm(event) {
  setForm({
    name: event.name,
    description: event.description,
    date: String(event.date).slice(0, 10),
    venue: event.venue,
  });

  setEditingId(event._id);
  navigate(`/edit-event/${event._id}`);
}

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save event");
      }

      if (editingId) {
        setEvents((previous) =>
          previous.map((event) =>
            event._id === editingId ? data : event
          )
        );
      } else {
        setEvents((previous) => [...previous, data]);
      }

      setForm(emptyForm);
setEditingId(null);
navigate("/");
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  async function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete event");
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== id)
      );
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">E</span>
          <div>
            <span className="brand-name">EventDesk</span>
            <span className="brand-caption">EVENT MANAGEMENT</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="nav-label">MAIN MENU</p>

          <button
            className={`nav-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("/")}
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
            <span className="nav-arrow">›</span>
          </button>

          <button
            className={`nav-item ${page === "add" ? "active" : ""}`}
            onClick={openAddForm}
          >
            <span className="nav-icon">＋</span>
            <span>Create Event</span>
          </button>
        </div>

        <div className="sidebar-promo">
          <div className="promo-icon">✦</div>
          <h3>Your events, organized.</h3>
          <p>Manage every event from one simple workspace.</p>
          <button onClick={openAddForm}>Create an event ↗</button>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">A</div>
          <div className="profile-details">
            <strong>Administrator</strong>
            <p>Workspace Admin</p>
          </div>
          <span className="profile-menu">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>
              {page === "dashboard"
                ? "Dashboard"
                : editingId
                  ? "Edit Event"
                  : "Create Event"}
            </strong>
          </div>

          <div className="topbar-right">
            <span className="system-status">
              <span className="status-dot"></span>
              Admin workspace
            </span>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        {page === "dashboard" ? (
          <section className="dashboard-content">
            <div className="welcome">
              <div className="welcome-content">
                <span className="eyebrow">
                  <span className="eyebrow-dot"></span>
                  YOUR EVENT WORKSPACE
                </span>

                <h1>
                  Make every event
                  <br />
                  <span>count.</span>
                </h1>

                <p className="welcome-text">
                  Plan, organize and keep track of all your events
                  from one central dashboard.
                </p>

                <button className="primary-btn" onClick={openAddForm}>
                  <span>＋</span> Create New Event
                </button>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="hero-orbit orbit-one"></div>
                <div className="hero-orbit orbit-two"></div>
                <div className="hero-glow"></div>
                <div className="hero-calendar">
                  <div className="calendar-top">
                    <span></span>
                    <span></span>
                  </div>
                  <div className="calendar-title">EVENT</div>
                  <div className="calendar-date">24</div>
                  <div className="calendar-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="floating-star star-one">✦</div>
                <div className="floating-star star-two">✧</div>
                <div className="floating-card">
                  <span className="floating-card-dot"></span>
                  Events organized
                </div>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <p className="section-kicker">AT A GLANCE</p>
                <h2>Workspace overview</h2>
              </div>
              <span className="live-label">
                <span className="status-dot"></span>
                Live data
              </span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon violet">▦</span>
                  <span className="stat-tag">ALL TIME</span>
                </div>
                <p className="stat-heading">Total Events</p>
                <div className="stat-number">{events.length}</div>
                <p className="stat-note">Events in your workspace</p>
                <div className="stat-bottom-line violet-line"></div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon green">♧</span>
                  <span className="stat-tag">ALL TIME</span>
                </div>
                <p className="stat-heading">Registrations</p>
                <div className="stat-number">{totalRegistrations}</div>
                <p className="stat-note">Across all your events</p>
                <div className="stat-bottom-line green-line"></div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon orange">◷</span>
                  <span className="stat-tag">SCHEDULED</span>
                </div>
                <p className="stat-heading">Upcoming Events</p>
                <div className="stat-number">{upcomingEvents}</div>
                <p className="stat-note">Today and in the future</p>
                <div className="stat-bottom-line orange-line"></div>
              </div>
            </div>

            <div className="table-panel">
              <div className="table-heading">
                <div>
                  <p className="section-kicker">EVENT DIRECTORY</p>
                  <h2>All events</h2>
                  <p className="table-subtitle">
                    View and manage your scheduled events.
                  </p>
                </div>

                <div className="table-tools">
                  <label className="search-box">
                    <span>⌕</span>
                    <input
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>

                  <button
                    className="secondary-create-btn"
                    onClick={openAddForm}
                  >
                    ＋ New event
                  </button>
                </div>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                     <th>EVENT ID</th>
<th>EVENT NAME</th>
<th>DATE</th>
<th>VENUE</th>
<th>REGISTRATIONS</th>
<th>STATUS</th>
<th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          Loading events...
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      filteredEvents.map((event) => {
                        const isUpcoming =
                          String(event.date).slice(0, 10) >= today;

                        return (
                          <tr key={event._id}>
                          <td>
  <span className="event-id">
    EVT-{String(event._id).slice(-5).toUpperCase()}
  </span>
</td>

<td>
  <div className="event-cell">
    <div className="event-letter">
      {event.name.charAt(0).toUpperCase()}
    </div>

    <div className="event-details">
      <strong>{event.name}</strong>
    </div>
  </div>
</td>

                            <td>{formatDate(event.date)}</td>
                            <td>{event.venue}</td>

                            <td>
                              <span className="registration-count">
                                {event.registrations || 0}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`event-status ${
                                  isUpcoming ? "upcoming" : "completed"
                                }`}
                              >
                                <span></span>
                                {isUpcoming ? "Upcoming" : "Completed"}
                              </span>
                            </td>

                            <td>
                              <div className="actions">
                                <button
                                  className="edit-btn"
                                  onClick={() => openEditForm(event)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="delete-btn"
                                  onClick={() => deleteEvent(event._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                    {!loading && filteredEvents.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          {search
                            ? "No matching events found."
                            : "No events yet. Create your first event!"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span>
                  Showing {filteredEvents.length} of {events.length} events
                </span>
                <span>EventDesk Workspace</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="form-panel">
            <div className="form-intro">
              <span className="eyebrow">
                <span className="eyebrow-dot"></span>
                EVENT CONFIGURATION
              </span>
              <h1>
                {editingId ? "Edit your event" : "Create an event"}
              </h1>
              <p>
                {editingId
                  ? "Update the details below and save your changes."
                  : "Fill in the details to add a new event to your workspace."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-section-label">
                <span>01</span> Basic information
              </div>

              <div className="form-field">
                <label htmlFor="name">Event name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="e.g. Annual Technology Summit"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Tell us a little about this event..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-section-label second-label">
                <span>02</span> Schedule and location
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="date">Event date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="venue">Venue</label>
                  <input
                    id="venue"
                    name="venue"
                    value={form.venue}
                    onChange={updateField}
                    placeholder="e.g. Main Conference Hall"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    navigate("/");
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingId ? "Save Changes →" : "Create Event →"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
