const firebaseConfig = {
    apiKey: "AIzaSyDaHHjMdchgRKCq-xDTzT2p1-WBP8KI9h4",
    authDomain: "ipl-auction-game-89635.firebaseapp.com",
    databaseURL: "https://ipl-auction-game-89635-default-rtdb.firebaseio.com",
    projectId: "ipl-auction-game-89635",
    storageBucket: "ipl-auction-game-89635.firebasestorage.app",
    messagingSenderId: "1068660815248",
    appId: "1:1068660815248:web:29f41524ab94c7de952f15"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
{
    "config": {
      "auctionStatus": "paused", // paused, running, completed
      "currentPlayer": null,
      "timer": 30,
      "auctionRound": 1
    },
    "players": {
      "player1": {
        "id": "player1",
        "name": "Virat Kohli",
        "age": 34,
        "role": "Batsman",
        "specialty": "Top Order", // New field
        "basePrice": 2000000,
        "currentBid": 0,
        "team": null,
        "image": "kohli.jpg",
        "status": "unsold", // unsold, sold, ongoing
        "nationality": "Indian",
        "stats": { // New field
          "matches": 237,
          "runs": 7263,
          "avg": 37.25,
          "strikeRate": 130.02
        }
      }
    },
    "teams": {
      "MI": {
        "id": "MI",
        "name": "Mumbai Indians",
        "budget": 100000000,
        "remainingBudget": 100000000,
        "players": {},
        "owner": "Admin",
        "icon": "mi.png",
        "maxPlayers": 25,
        "maxOverseas": 8
      }
    },
    "users": {
      "user1": {
        "email": "team@mi.com",
        "teamId": "MI",
        "role": "team" // admin, team
      }
    }
  }