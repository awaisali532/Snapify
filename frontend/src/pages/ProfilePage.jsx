import React from "react";

const ProfilePage = () => {
  // LocalStorage se user ka data nikal kar dikhayenge
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-snap-dark text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to VIP Room! 🚀</h1>
      <div className="bg-white dark:bg-snap-card p-6 rounded-lg shadow-lg text-center">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.name}&background=facc15&color=000&size=128&bold=true`}
          alt="Profile"
          className="rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
        <span className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
          Role: {user?.role || "User"}
        </span>
      </div>
    </div>
  );
};

export default ProfilePage;
