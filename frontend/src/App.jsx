import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/students/";

function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    register_number: "",
    department: "",
    year: "",
    email: "",
    phone: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const dataToSend = {
        name: formData.name.trim(),
        register_number: formData.register_number.trim(),
        department: formData.department.trim(),
        year: Number(formData.year),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, dataToSend);
        setMessage("Student updated successfully!");
      } else {
        await axios.post(API_URL, dataToSend);
        setMessage("Student added successfully!");
      }

      resetForm();
      fetchStudents();

    } catch (error) {
      console.log("ERROR FROM BACKEND:", error.response?.data);

      const errorData = error.response?.data;

      if (!errorData) {
        setMessage("Unable to connect to the server.");
        return;
      }

      // Display the first backend validation error
      const firstError = Object.values(errorData).flat()[0];

      if (firstError) {
        setMessage(firstError);
      } else {
        setMessage("Please check the entered details.");
      }
    }
  };

  const editStudent = (student) => {
    setFormData({
      name: student.name,
      register_number: student.register_number,
      department: student.department,
      year: student.year,
      email: student.email,
      phone: student.phone,
    });

    setEditingId(student.id);
    setMessage("");
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}${id}/`);
      setMessage("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      setMessage("Unable to delete student.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      register_number: "",
      department: "",
      year: "",
      email: "",
      phone: "",
    });

    setEditingId(null);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.register_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">

      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage student records easily</p>
      </header>

      <main className="container">

        <section className="form-card">

          <h2>
            {editingId ? "Update Student" : "Add Student"}
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="register_number"
              placeholder="Register Number"
              value={formData.register_number}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="year"
              placeholder="Year (1-4)"
              min="1"
              max="4"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div className="buttons">

              <button type="submit">
                {editingId ? "Update Student" : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

        </section>

        <section className="table-card">

          <h2>Student Records</h2>

          <input
            type="text"
            className="search-box"
            placeholder="Search by name or register number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredStudents.length === 0 ? (

            <p className="empty">
              No student records found.
            </p>

          ) : (

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Register No.</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map((student) => (

                    <tr key={student.id}>

                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.register_number}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>

                      <td>

                        <button
                          className="edit"
                          onClick={() => editStudent(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() => deleteStudent(student.id)}
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

        </section>

      </main>

    </div>
  );
}

export default App;