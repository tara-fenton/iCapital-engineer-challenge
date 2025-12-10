import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    street: "",
    state: "",
    zip: "",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("firstName", form.firstName);
    data.append("lastName", form.lastName);
    data.append("dob", form.dob);
    data.append("phone", form.phone);
    data.append("street", form.street);
    data.append("state", form.state);
    data.append("zip", form.zip);

    // MUST be "files" to match upload.array("files")
    files.forEach((file) => {
      data.append("files", file);
    });

    try {
      const res = await fetch("http://localhost:3000/api/investors", {
        method: "POST",
        body: data, // don't set Content-Type manually
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body.message || "Something went wrong");
        console.error("Server error:", body);
        return;
      }

      console.log("Server response:", body);
      setSuccess("Uploaded successfully!");

      // optional reset
      setForm({
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        street: "",
        state: "",
        zip: "",
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First name"
        value={form.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        placeholder="Last name"
        value={form.lastName}
        onChange={handleChange}
      />
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />
      <input
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
      />
      <input
        name="state"
        placeholder="State (US)"
        maxLength={2}
        value={form.state}
        onChange={handleChange}
      />
      <input
        name="zip"
        placeholder="Zip"
        value={form.zip}
        onChange={handleChange}
      />

      <input
        type="file"
        name="files"   // <-- matches upload.array("files")
        multiple
        onChange={handleFileChange}
      />

      <button type="submit">Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}

export default App;
