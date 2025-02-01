import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Renamed for clarity
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);

  const handleUserSelect = (userId) => {
    setSelectedUserIds((prev) => {
      // If userId is already selected, remove it
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      // If userId is not selected, add it
      return [...prev, userId];
    });
  };

  useEffect(() => {
    initializeSocket();

    axios
      .get(`projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });

    axios
      .get(`/users/all`)
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });

    // Reset selected users on component mount
    setSelectedUserIds([]);
  }, []); // Empty dependency array means this runs once on mount

  // Clear the selectedUserIds state when the modal is closed
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserIds([]); // Reset the selected users array when modal is closed
  };

  const addUsers = () => {
    // Send a request to the backend to add the selected users to the project
    axios
      .put(`/projects/add-user`, {
        projectId: location.state.project._id,
        users: selectedUserIds,
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });
  };

  return (
    <main className="bg-gray-900 min-h-screen text-gray-100 flex">
      <section className="left relative flex flex-col min-h-screen w-1/3 bg-gray-800">
        {/* Header */}
        <header className="flex justify-between items-center p-4 w-full bg-gray-950">
          <div className="text-white font-semibold text-lg capitalize">
            {location.state.project.name}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="ri-user-add-line text-white text-xl"></i>
            </button>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="ri-group-line text-white text-xl"></i>
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div className="chat-container h-10 flex flex-col flex-grow p-4 overflow-y-auto">
          {/* Received Message */}
          <div className="max-w-[75%] bg-gray-700 text-white p-3 rounded-lg mb-3 self-start">
            <span className="text-xs text-gray-400 block">
              sender@example.com
            </span>
            <p className="m-0">Hey! How’s it going?</p>
          </div>

          {/* Sent Message */}
          <div className="max-w-[75%] bg-blue-900 text-white p-3 rounded-lg mb-3 self-end">
            <span className="text-xs text-gray-400 block">
              receiver@example.com
            </span>
            <p>All good! What about you?</p>
          </div>
        </div>

        {/* Input Box */}
        <div className="w-full flex items-center bg-gray-950 p-2 gap-2">
          <input
            className="w-[80%] p-3 bg-gray-900 text-gray-100 outline-none rounded-lg"
            type="text"
            placeholder="Your message here"
          />
          <button className="w-[20%] bg-blue-900 p-3 rounded-lg">
            <i className="ri-send-plane-fill text-white"></i>
          </button>
        </div>

        <div
          className={`side-panel w-full h-full bg-gray-800 absolute top-0 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all z-50`}
        >
          <div className="flex justify-between items-center p-4 bg-gray-950 ">
            <div className="text-white font-semibold text-lg">Users</div>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <i className="ri-close-line text-white text-xl"></i>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {project.users &&
              project.users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"></div>
                  <div className="text-white">{user.email}</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <div>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="bg-gray-800 p-6 rounded-md shadow-md w-full max-w-md text-gray-100">
              <h2 className="text-xl font-bold mb-4 text-center">
                Select Users
              </h2>

              {/* User List */}
              <div className="user-list space-y-4 max-h-80 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-200 ${
                      selectedUserIds.includes(user._id)
                        ? "bg-blue-800 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="text-white">{user.email}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-4 text-center space-x-4">
                <button
                  onClick={() => {
                    addUsers();
                    closeModal();
                  }}
                  className="w-[48%] bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white"
                >
                  Add
                </button>
                <button
                  onClick={closeModal}
                  className="w-[48%] bg-red-600 hover:bg-red-700 p-3 rounded-lg text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Project;
