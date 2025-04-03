firebase.database().ref('admins/' + user.uid).once('value')
  .then((snapshot) => {
    if (!snapshot.exists()) {
      alert('Admin access required');
      firebase.auth().signOut();
    }
  });
document.getElementById('addPlayerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const player = {
        name: document.getElementById('playerName').value,
        age: document.getElementById('playerAge').value,
        role: document.getElementById('playerRole').value,
        basePrice: document.getElementById('basePrice').value,
        currentBid: 0,
        team: null,
        image: document.getElementById('playerImage').value || 'default.jpg'
    };
    
    // Push to Firebase
    database.ref('players').push(player);
    
    // Reset form
    this.reset();
});

// Display existing players
database.ref('players').on('value', (snapshot) => {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    snapshot.forEach((childSnapshot) => {
        const player = childSnapshot.val();
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-card';
        playerDiv.innerHTML = `
            <img src="${player.image}" alt="${player.name}">
            <h4>${player.name}</h4>
            <p>${player.role} | Base: ₹${player.basePrice.toLocaleString()}</p>
            <button onclick="deletePlayer('${childSnapshot.key}')">Delete</button>
        `;
        playersList.appendChild(playerDiv);
    });
});

function deletePlayer(playerId) {
    database.ref('players/' + playerId).remove();
}
// Auction Controls
document.getElementById('startAuction').addEventListener('click', () => {
    database.ref('config/auctionStatus').set('running');
    startNextPlayer();
  });
  
  document.getElementById('pauseAuction').addEventListener('click', () => {
    database.ref('config/auctionStatus').set('paused');
  });
  
  document.getElementById('nextPlayer').addEventListener('click', () => {
    startNextPlayer();
  });
  
  async function startNextPlayer() {
    // Find next unsold player
    const playersSnapshot = await database.ref('players').once('value');
    const players = playersSnapshot.val();
    let nextPlayer = null;
    
    for (const [id, player] of Object.entries(players)) {
      if (player.status === 'unsold') {
        nextPlayer = id;
        break;
      }
    }
    
    if (nextPlayer) {
      database.ref('config').update({
        currentPlayer: nextPlayer,
        timer: parseInt(document.getElementById('bidTimer').value)
      });
      
      database.ref('players/' + nextPlayer + '/status').set('ongoing');
    } else {
      database.ref('config/auctionStatus').set('completed');
      alert("Auction completed! All players sold.");
    }
  }
  
  // Team Management
  function renderTeams() {
    database.ref('teams').on('value', (snapshot) => {
      const teamsList = document.getElementById('teamsList');
      teamsList.innerHTML = '';
      
      snapshot.forEach((teamSnapshot) => {
        const team = teamSnapshot.val();
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-card';
        teamDiv.innerHTML = `
          <img src="${team.icon}" alt="${team.name}">
          <h4>${team.name}</h4>
          <p>Budget: ₹${team.remainingBudget.toLocaleString()}/${team.budget.toLocaleString()}</p>
          <p>Players: ${Object.keys(team.players || {}).length}/${team.maxPlayers}</p>
          <button onclick="editTeam('${team.id}')">Edit</button>
        `;
        teamsList.appendChild(teamDiv);
      });
    });
  }
  
  // Player Import/Export
  document.getElementById('importPlayers').addEventListener('click', () => {
    const fileInput = document.getElementById('playerCsv');
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const csv = e.target.result;
        const players = parseCSV(csv);
        
        players.forEach(player => {
          database.ref('players').push({
            ...player,
            status: 'unsold',
            currentBid: 0,
            team: null
          });
        });
      };
      reader.readAsText(file);
    }
  });
  
  function parseCSV(csv) {
    // Implement CSV parsing logic
    return []; // Return array of player objects
  }
  // Player Management
function addPlayer(playerData) {
  return database.ref('players').push(playerData);
}

function updatePlayer(playerId, updates) {
  return database.ref('players/' + playerId).update(updates);
}

// Auction Control
function startAuction() {
  return database.ref('auction/status').set('running');
}

function setNextPlayer(playerId) {
  return database.ref('auction').update({
    currentPlayer: playerId,
    status: 'running'
  });
}

// Real-time Listeners
function setupRealTimeUpdates() {
  // Players listener
  database.ref('players').on('value', (snapshot) => {
    const players = snapshot.val();
    // Update your UI here
  });
  
  // Auction status listener
  database.ref('auction').on('value', (snapshot) => {
    const auction = snapshot.val();
    // Update timer and status UI
  });
}