import Sidebar from "../components/sidebar";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  onValue,
  update,
  get,
  set,
  remove,
} from "firebase/database";

function Window1() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC1-rPcvqin2WWSAA96N5Gp2L1538PCuJ8",
    authDomain: "easyq-s.firebaseapp.com",
    databaseURL: "https://easyq-s-default-rtdb.firebaseio.com",
    projectId: "easyq-s",
    storageBucket: "easyq-s.firebasestorage.app",
    messagingSenderId: "485410986210",
    appId: "1:485410986210:web:aa2dab9b4e00917212a6bb",
    measurementId: "G-VC0BZM9ERT",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const [currentQueue, setCurrentQueue] = useState(null);
  const [currentQueueId, setCurrentQueueId] = useState(null);

  useEffect(() => {
    fetchNextQueue();
    console.log("Component rendered");
  }, []);

  const fetchNextQueue = () => {
    setCurrentQueue(null);
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

          update(queueRef, {
            Status: "Processing",
            StartTime: startTime,
            Window_Received: "Window1",
          })
            .then(() => {
              setCurrentQueue(data[firstEntryKey]);
            })
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

  const completeCurrentQueue = () => {
    if (currentQueueId && confirm("Are you sure you want to proceed to the next queue?")) {
      const currentQueueRef = ref(db, `queues/${currentQueueId}`);
      get(currentQueueRef).then((snapshot) => {
        if (snapshot.exists()) {
          const currentData = snapshot.val();
          const endTime = new Date().toISOString();
          const startTimeMillis = Date.parse(currentData.StartTime);
          const endTimeMillis = Date.now();
          const processingTimeMillis = endTimeMillis - startTimeMillis;

          const readableProcessingTime = formatProcessingTime(processingTimeMillis);

          const queueNumber = currentData.Queue_Number || "Unknown";
          const dateCompleted = new Date().toISOString().split("T")[0].replace(/-/g, "");
          const newKey = `Q${queueNumber}_${dateCompleted}`;

          const completedQueueRef = ref(db, `CompletedQueues/${newKey}`);
          set(completedQueueRef, {
            ...currentData,
            Status: "Completed",
            CompletedTime: endTime,
            ProcessingTime: readableProcessingTime,
          })
            .then(() => {
              remove(ref(db, `queues/${currentQueueId}`))
                .then(() => {
                  alert(`Queue ${queueNumber} completed and saved successfully!`);
                  fetchNextQueue();
                })
                .catch((error) => {
                  console.error("Error removing completed queue:", error);
                });
            })
            .catch((error) => {
              console.error("Error saving completed queue:", error);
              alert("Failed to save completed queue. Please try again.");
            });
        }
      });
    }
  };

  const cancelCurrentQueue = () => {
    if (currentQueueId && confirm("Are you sure you want to cancel this queue?")) {
      const reason = prompt("Please enter the reason for cancellation:");
      if (reason) {
        const currentQueueRef = ref(db, `queues/${currentQueueId}`);
        const endTime = new Date().toISOString();

        get(currentQueueRef).then((snapshot) => {
          if (snapshot.exists()) {
            const currentData = snapshot.val();
            const startTimeMillis = Date.parse(currentData.StartTime);
            const endTimeMillis = Date.now();
            const processingTimeMillis = endTimeMillis - startTimeMillis;

            const readableProcessingTime = formatProcessingTime(processingTimeMillis);

            const queueNumber = currentData.Queue_Number || "Unknown";
            const dateCancelled = new Date().toISOString().split("T")[0].replace(/-/g, "");
            const newKey = `Q${queueNumber}_${dateCancelled}`;

            const completedQueueRef = ref(db, `CompletedQueues/${newKey}`);
            set(completedQueueRef, {
              ...currentData,
              Status: "Cancelled",
              CancelReason: reason,
              CompletedTime: endTime,
              ProcessingTime: readableProcessingTime,
            }).then(() => {
              remove(ref(db, `queues/${currentQueueId}`)).then(() => {
                alert(`Queue ${queueNumber} cancelled and removed.`);
                fetchNextQueue();
              });
            });
          }
        });
      }
    }
  };

  const formatProcessingTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    const formattedTime = [];
    if (hours > 0) formattedTime.push(`${hours} hours`);
    if (minutes > 0) formattedTime.push(`${minutes} minutes`);
    formattedTime.push(`${seconds} seconds`);

    return formattedTime.join(", ");
  };

  return (
    <>
      <Sidebar />
      <div className="win-container">
        <div className="card">
          <h2 className="win-heading">FINANCE WINDOW 1</h2>
          <div className="user-container">
            <div className="user-info">
              <h3 className="uid">User ID: {currentQueue?.UserID || "N/A"}</h3>
              <h3 className="name">Name: {currentQueue?.Name || "N/A"}</h3>
              <h3 className="email">Email: {currentQueue?.Email || "N/A"}</h3>
              <h3 className="contact">Contact No: {currentQueue?.ContactNumber || "N/A"}</h3>
              <h3 className="purpose">Purpose: {currentQueue?.Queue_Purpose || "N/A"}</h3>
            </div>
          </div>
          <div className="queue-container">
            <h2 className="now-serving">Current Queue:</h2>
            <h2 className="q-num">{currentQueue?.Queue_Number || "N/A"}</h2>
          </div>
          <div className="button-cont">
            <button className="cancel" onClick={cancelCurrentQueue}>
              Cancel
            </button>
            <button className="recall">Recall</button>
            <button className="next" onClick={completeCurrentQueue}>
              Next Queue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Window1;
