import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);

  const navigate = useNavigate();

  const createProject = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });

    setProjectName("");
  };

  useEffect(() => {
    // Fetch user's projects when the component mounts
    axios
      .get("/projects/all")
      .then((res) => {
        console.log(res.data);
        setProject(res.data.projects);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });
  }, []); // Only fetch projects when user or token changes

  return (
    <main className="p-4 bg-gray-900 min-h-screen text-gray-100">
      {/* Projects Button */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Create Project Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="project cursor-pointer flex items-center justify-between p-2 h-12 border border-gray-600 rounded-md text-gray-100 bg-gray-800 hover:bg-gray-700 transition duration-200 min-w-[200px] w-full sm:w-auto"
        >
          <div className="flex items-center gap-2">
            <i className="ri-link text-blue-400"></i>
            <span className="font-medium">Create Project</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-md">
            <i className="ri-sticky-note-add-line text-gray-300"></i>
          </div>
        </button>

        {/* Render Projects */}
        {project.map((project) => (
          <div
            onClick={() =>
              navigate("/project", {
                state: { project },
              })
            }
            key={project._id}
            className="project cursor-pointer flex items-center justify-between p-2 h-12 border border-gray-600 rounded-md text-gray-100 bg-gray-800 hover:bg-gray-700 transition duration-200 min-w-[200px] w-full sm:w-auto"
          >
            {/* Project Name */}
            <div className="flex items-center gap-2">
              <i className="ri-link text-blue-400"></i>
              <span className="font-medium capitalize">{project.name}</span>
            </div>

            {/* User Count */}
            <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-md">
              <i className="ri-user-line text-gray-300"></i>
              <span className="text-sm font-medium">
                {project.users.length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="bg-gray-800 p-6 rounded-md shadow-md w-full max-w-md text-gray-100">
              <h2 className="text-xl font-bold mb-4 text-center">
                Create New Project
              </h2>
              <form onSubmit={createProject}>
                {/* Input */}
                <div className="mb-4">
                  <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="projectName"
                  >
                    Project Name
                  </label>
                  <input
                    required
                    type="text"
                    id="projectName"
                    name="projectName"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
