import React from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
  const location = useLocation();
  console.log(location.state);

  return (
    <main className="bg-gray-900 min-h-screen text-gray-100 flex">
      <section className="left flex flex-col min-h-screen w-1/3 bg-gray-800">
        {/* Header */}
        <header className="flex justify-between items-center p-4 w-full bg-gray-950">
          <div className="text-white font-semibold text-lg">
            {location.state.project.name}
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <i className="ri-group-line text-white text-xl"></i>
          </button>
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
      </section>
    </main>
  );
};

export default Project;
