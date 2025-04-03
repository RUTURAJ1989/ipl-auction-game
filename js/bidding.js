let currentPlayerId = null;
let timer = null;

// Listen for active player
database.ref('auction/currentPlayer').on('value', (snapshot) => {
    currentPlayerId = snapshot.val();
    if (currentPlayerId) {
        loadPlayer(currentPlayerId);
        startTimer();
    }
});

function loadPlayer(playerId) {
    database.ref('players/' + playerId).once('value').then((snapshot) => {
        const player = snapshot.val();
        document.getElementById('currentPlayerName').textContent = player.name;
        document.getElementById('currentPlayerImage').src = player.image;
        document.getElementById('currentPlayerRole').textContent = player.role;
        document.getElementById('currentPlayerBasePrice').textContent = player.basePrice.toLocaleString();
        document.getElementById('currentBidAmount').textContent = (player.currentBid || 0).toLocaleString();
        document.getElementById('leadingTeam').textContent = player.team || 'None';
    });
}

document.getElementById('placeBidBtn').addEventListener('click', () => {
    const bidAmount = parseInt(document.getElementById('bidAmount').value);
    const team = document.getElementById('teamSelect').value;
    
    if (bidAmount && currentPlayerId) {
        database.ref('players/' + currentPlayerId).update({
            currentBid: bidAmount,
            team: team
        });
    }
});

function startTimer() {
    clearInterval(timer);
    let timeLeft = 30;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Move to next player (admin would handle this)
        }
    }, 1000);
}
// Initialize
let currentPlayerId = null;
let timerInterval = null;
let currentTimer = 0;
let maxTimer = 30;

// Team budget indicators
function renderTeamBudgets() {
  database.ref('teams').once('value').then((snapshot) => {
    const teamsContainer = document.querySelector('.team-budgets');
    teamsContainer.innerHTML = '';
    
    snapshot.forEach((teamSnapshot) => {
      const team = teamSnapshot.val();
      const teamDiv = document.createElement('div');
      teamDiv.className = 'team-budget';
      teamDiv.innerHTML = `
        <img src="${team.icon}" alt="${team.name}">
        <div class="progress-bar">
          <div class="progress" style="width: ${(team.remainingBudget / team.budget) * 100}%"></div>
        </div>
        <span>₹${team.remainingBudget.toLocaleString()}</span>
      `;
      teamsContainer.appendChild(teamDiv);
    });
  });
}

// Enhanced player display
function loadPlayer(playerId) {
  database.ref('players/' + playerId).once('value').then((snapshot) => {
    const player = snapshot.val();
    
    // Update UI
    document.getElementById('currentPlayerName').textContent = player.name;
    document.getElementById('playerNationality').textContent = player.nationality;
    document.getElementById('playerMatches').textContent = player.stats?.matches || '-';
    document.getElementById('playerAverage').textContent = player.stats?.avg || '-';
    
    // Update bid history
    updateBidHistory(playerId);
  });
}

function updateBidHistory(playerId) {
  database.ref('players/' + playerId).on('value', (snapshot) => {
    const player = snapshot.val();
    document.getElementById('currentBidAmount').textContent = 
      player.currentBid ? player.currentBid.toLocaleString() : '0';
    document.getElementById('leadingTeam').textContent = 
      player.team || 'None';
  });
}

// Animated timer
function startTimer(seconds) {
  clearInterval(timerInterval);
  currentTimer = seconds;
  maxTimer = seconds;
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    currentTimer--;
    updateTimerDisplay();
    
    if (currentTimer <= 0) {
      clearInterval(timerInterval);
      finalizePlayer();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const countdown = document.getElementById('countdown');
  const progress = document.querySelector('.timer-progress');
  
  countdown.textContent = currentTimer;
  const percentage = (currentTimer / maxTimer) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  
  progress.style.strokeDashoffset = offset;
}

// Finalize player sale
function finalizePlayer() {
  if (!currentPlayerId) return;
  
  database.ref('players/' + currentPlayerId).once('value').then((snapshot) => {
    const player = snapshot.val();
    
    if (player.team) {
      // Player sold
      database.ref('players/' + currentPlayerId + '/status').set('sold');
      
      // Add to team
      database.ref('teams/' + player.team + '/players/' + currentPlayerId).set(true);
      
      // Add to sold players display
      addToSoldPlayers(currentPlayerId, player);
    } else {
      // Player unsold
      database.ref('players/' + currentPlayerId + '/status').set('unsold');
    }
    
    // Move to next player
    database.ref('config/currentPlayer').set(null);
  });
}

// Quick bid buttons
document.querySelectorAll('.quick-bid').forEach(button => {
  button.addEventListener('click', function() {
    const currentBid = parseInt(document.getElementById('currentBidAmount').textContent.replace(/,/g, '')) || 0;
    const increment = parseInt(this.dataset.amount);
    document.getElementById('bidAmount').value = currentBid + increment;
  });
});
// Listen for auction updates
firebase.database().ref('auction/current').on('value', (snapshot) => {
  const playerId = snapshot.val();
  if (playerId) loadPlayer(playerId);
});

// Place bid
function placeBid(amount, teamId) {
  const updates = {};
  updates['players/'+playerId+'/currentBid'] = amount;
  updates['players/'+playerId+'/team'] = teamId;
  updates['teams/'+teamId+'/remaining'] = firebase.database.ServerValue.increment(-amount);
  return firebase.database().ref().update(updates);
}