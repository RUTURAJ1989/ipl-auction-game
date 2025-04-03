const firebaseConfig = {
  apiKey: "AIzaSyDaHHjMdchgRKCq-xDTzT2p1-WBP8KI9h4",
  authDomain: "ipl-auction-game-89635.firebaseapp.com",
  databaseURL: "https://ipl-auction-game-89635-default-rtdb.firebaseio.com",
  projectId: "ipl-auction-game-89635",
  storageBucket: "ipl-auction-game-89635.firebasestorage.app",
  messagingSenderId: "1068660815248",
  appId: "1:1068660815248:web:29f41524ab94c7de952f15",
  measurementId: "G-BNJZMTCGVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
{
  {
    "players": {
      "player1": {
        "name": "Virat Kohli",
        "age": 34,
        "role": "Batsman",
        "basePrice": 20000000,
        "status": "available", // available/ongoing/sold
        "team": null,
        "image": "https://example.com/virat.jpg",
        "stats": {
          "matches": 237,
          "runs": 7263,
          "wickets": 4,
          "average": 37.25
        }
      }
    },
    "teams": {
      "MI": {
        "name": "Mumbai Indians",
        "budget": 100000000,
        "remaining": 85000000,
        "players": {
          "player1": true
        }
      }
    },
    "auction": {
      "status": "paused", // paused/running
      "currentPlayer": null,
      "timer": 30
    }
  }