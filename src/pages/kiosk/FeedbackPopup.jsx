import React, { useState } from "react";
import "./FeedbackPopup.css";

const FeedbackPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, message }),
    });
    alert("Thank you for your feedback!");
    setIsOpen(false);
    setRating(0);
    setMessage("");
  };

  return (
    <div>
      <button className="feedback-btn" onClick={() => setIsOpen(true)}>
        ⭐ Feedback
      </button>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Rate the Kiosk</h2>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={num <= rating ? "star selected" : "star"}
                  onClick={() => setRating(num)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write feedback (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPopup;
