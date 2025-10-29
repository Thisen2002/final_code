import React, { useState, useEffect } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/notifications/selected");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Notification[] = await response.json();

        // Optional: simulate small delay
        await new Promise((res) => setTimeout(res, 1000));

        setNotifications(data);
      } catch (err) {
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col items-center text-center p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <p className="text-gray-300 mb-6">
        Stay up-to-date with the latest updates and alerts
      </p>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-gray-400">No notifications available.</p>
      )}

      <div className="w-full max-w-3xl space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="bg-gray-800 rounded-2xl p-4 shadow-md hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-300 mt-1">{note.message}</p>
            <p className="text-sm text-gray-500 mt-2">{note.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
