import SidebarAd1 from "../components/sidebarAd1";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { database } from "../firebase.config"; // Import from firebaseconfig.js
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  onValue,
  update,
  push,
  remove,
} from "firebase/database";

function Window1() {
  const db = database; // Use imported database instance

  // State management
  const [currentQueue, setCurrentQueue] = useState(null);
  const [currentQueueId, setCurrentQueueId] = useState(null);
  const [window1Status, setWindow1Status] = useState("Active");

  // Fetch the next queue when component mounts
  useEffect(() => {
    fetchNextQueue();
    fetchWindowStatus();
  }, []);

  // Fetch next queue
  const fetchNextQueue = () => {
    setCurrentQueue(null); // Clear current queue data
    const nextQueueQuery = query(
      ref(db, "queues"),
      orderByChild("Status"),
      equalTo("Pending"),
      limitToFirst(1)
    );

    onValue(
      nextQueueQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const firstEntryKey = Object.keys(data)[0];
          setCurrentQueueId(firstEntryKey);

          const queueRef = ref(db, `queues/${firstEntryKey}`);
          const startTime = new Date().toISOString();

          update(queueRef, { Status: "Processing", StartTime: startTime, Window_Received: "Window1" })
            .then(() => setCurrentQueue(data[firstEntryKey]))
            .catch((error) => {
              console.error("Error updating queue status:", error);
            });
        } else {
          alert("No more pending queues!");
        }
      },
      { onlyOnce: true }
    );
  };

  // Complete current queue
  const completeCurrentQueue = () => {
    if (!currentQueueId) return;

    if (confirm("Are you sure you want to proceed to the next queue?")) {
      const currentQueueRef = ref(db, `queues/${currentQueueId}`);

      onValue(
        currentQueueRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const currentData = snapshot.val();
            const endTime = new Date();
            const startTimeMillis = Date.parse(currentData.StartTime);
            const processingTimeMillis = Date.now() - startTimeMillis;
        
            if (isNaN(startTimeMillis) || isNaN(processingTimeMillis)) {
                alert("Cannot calculate processing time. StartTime is missing or invalid.");
                return;
            }
        
            const formatToReadableDate = (date) =>
                date.toISOString().replace("T", " ").split(".")[0];
        
            const readableProcessingTime = formatProcessingTime(processingTimeMillis);
            const formattedEndTime = formatToReadableDate(endTime);
        
            push(ref(db, "CompletedQueues"), {
                ...currentData,
                Status: "Completed",
                Date_and_Time_Completed: formattedEndTime,
                ProcessingTime: readableProcessingTime,
            }).then(() => {
                remove(currentQueueRef).then(fetchNextQueue);
            });
          }
        },
        { onlyOnce: true }
      );
    }
  };

  // Cancel current queue
  const cancelCurrentQueue = () => {
    if (!currentQueueId) return;

    if (confirm("Are you sure you want to cancel this queue?")) {
        const reason = prompt("Please enter the reason for cancellation:");
        if (reason) {
            const currentQueueRef = ref(db, `queues/${currentQueueId}`);
            const endTime = new Date();

            const formatToReadableDate = (date) =>
                date.toISOString().replace("T", " ").split(".")[0];

            const formattedEndTime = formatToReadableDate(endTime);

            onValue(
                currentQueueRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const currentData = snapshot.val();
                        const startTimeMillis = Date.parse(currentData.StartTime);
                        const processingTimeMillis = Date.now() - startTimeMillis;

                        const readableProcessingTime = !isNaN(processingTimeMillis)
                            ? formatProcessingTime(processingTimeMillis)
                            : "N/A";

                        push(ref(db, "CompletedQueues"), {
                            ...currentData,
                            Status: "Cancelled",
                            CancelReason: reason,
                            CompletedTime: formattedEndTime,
                            ProcessingTime: readableProcessingTime,
                        }).then(() => {
                            remove(currentQueueRef).then(() => {
                                setCurrentQueue(null);
                                fetchNextQueue();
                            });
                        });
                    }
                },
                { onlyOnce: true }
            );
        } else {
            alert("Cancellation reason is required.");
        }
    }
};

  // Format processing time
  const formatProcessingTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours > 0 ? `${hours} hours, ` : ""}${minutes > 0 ? `${minutes} minutes, ` : ""}${seconds} seconds`;
  };

  // Fetch Window1 status
  const fetchWindowStatus = () => {
    const window1Ref = ref(db, "QueueSystemStatus/Window1/Status");
    onValue(window1Ref, (snapshot) => {
      setWindow1Status(snapshot.val());
    });
  };

  // Toggle Window1 status
  const handleToggleStatus = () => {
    const isDisabling = window1Status === "Active";
    const confirmMessage = isDisabling
      ? "Are you sure you want to disable Window 1?"
      : "Do you want to enable Window 1?";

    if (confirm(confirmMessage)) {
      const window1Ref = ref(db, "QueueSystemStatus/Window1");
      const newStatus = isDisabling ? "Inactive" : "Active";

      update(window1Ref, { Status: newStatus })
        .then(() => {
          alert(`Window 1 has been ${newStatus === "Inactive" ? "disabled" : "enabled"}.`);
        })
        .catch((error) => {
          console.error("Error updating status:", error);
          alert("Failed to update Window 1 status. Please try again.");
        });
    }
  };

  return (
    <>
      <SidebarAd1 />
      <div className="win1-container">
        <div className="win-headz">
          <h2 className="win-title">FINANCE WINDOW 1</h2>
          <button className="disable" onClick={handleToggleStatus}>
            {window1Status === "Active" ? "Disable" : "Enable"}
          </button>
        </div>
        <hr />
        <div className="user-container">
          <div className="userInfo-card">
             <div className="user-Info">
            <h3 className="uid">User ID:</h3>
            <span className="userInfo-value">  {currentQueue?.UserID || "N/A"} </span>
            </div>
             
            <div className="user-Info">
            <h3 className="uid">Name: </h3>
            <span className="userInfo-value"> {currentQueue?.Name || "N/A"} </span>
            </div>

            <div className="user-Info">
            <h3 className="uid">Email:</h3>
            <span className="userInfo-value">  {currentQueue?.Email || "N/A"} </span>
            </div>
             
            <div className="user-Info">
            <h3 className="uid">Contact No: </h3>
            <span className="userInfo-value"> {currentQueue?.ContactNumber || "N/A"} </span>
            </div>
            
            <div className="user-Info">
            <h3 className="uid">Purpose: </h3>
            <span className="userInfo-value"> {currentQueue?.Queue_Purpose || "N/A"} </span>
            </div>

          </div>
        </div>
        <div className="queue-container">
          <div className="q-wrapper">
            <div className="queue-card">
              <h2 className="current-queue">Current Queue:</h2>
              <h2 className="q-num">{currentQueue?.Queue_Number || "N/A"}</h2>
            </div>
          </div>
          <div className="qBtn-container">
            <button className="cancel" onClick={cancelCurrentQueue}>Cancel</button>
            <button className="recall">Recall</button>
            <button className="next" onClick={completeCurrentQueue}>Next Queue</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Window1;
