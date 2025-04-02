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