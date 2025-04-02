// Initialize team dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Get team ID from URL or authentication
    const teamId = getTeamId(); // Implement this based on your auth system
    
    if (teamId) {
      loadTeamData(teamId);
      setupAutoBidding(teamId);
    }
  });
  
  function loadTeamData(teamId) {
    // Load team info
    database.ref('teams/' + teamId).on('value', (snapshot) => {
      const team = snapshot.val();
      
      document.getElementById('teamName').textContent = team.name;
      document.getElementById('teamLogo').src = team.icon;
      document.getElementById('teamRemainingBudget').textContent = 
        team.remainingBudget.toLocaleString();
      document.getElementById('teamTotalBudget').textContent = 
        team.budget.toLocaleString();
      
      // Load players
      loadTeamPlayers(teamId);
    });
  }
  
  function loadTeamPlayers(teamId) {
    database.ref('teams/' + teamId + '/players').on('value', (teamPlayersSnapshot) => {
      const playerIds = Object.keys(teamPlayersSnapshot.val() || {});
      
      database.ref('players').once('value').then((allPlayersSnapshot) => {
        const players = allPlayersSnapshot.val();
        let batsmen = [];
        let allrounders = [];
        let bowlers = [];
        let keepers = [];
        let overseasCount = 0;
        
        playerIds.forEach(playerId => {
          const player = players[playerId];
          if (player) {
            if (player.nationality !== 'Indian') overseasCount++;
            
            switch(player.role) {
              case 'Batsman':
                batsmen.push(player);
                break;
              case 'All-Rounder':
                allrounders.push(player);
                break;
              case 'Bowler':
                bowlers.push(player);
                break;
              case 'Wicketkeeper':
                keepers.push(player);
                break;
            }
          }
        });
        
        // Update UI
        document.getElementById('totalPlayers').textContent = playerIds.length;
        document.getElementById('overseasPlayers').textContent = overseasCount;
        
        renderPlayerList('batsmenList', batsmen);
        renderPlayerList('allroundersList', allrounders);
        renderPlayerList('bowlersList', bowlers);
        renderPlayerList('keepersList', keepers);
        
        // Calculate strengths
        document.getElementById('battingStrength').textContent = 
          calculateBattingStrength(batsmen, allrounders, keepers);
        document.getElementById('bowlingStrength').textContent = 
          calculateBowlingStrength(bowlers, allrounders);
      });
    });
  }
  
  function renderPlayerList(elementId, players) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    players.forEach(player => {
      const playerCard = document.createElement('div');
      playerCard.className = 'squad-player';
      playerCard.innerHTML = `
        <img src="${player.image}" alt="${player.name}">
        <div class="player-info">
          <h4>${player.name}</h4>
          <p>₹${player.currentBid.toLocaleString()}</p>
          <p>${player.specialty || ''}</p>
        </div>
      `;
      container.appendChild(playerCard);
    });
  }
  
  // Auto-bidding functionality
  function setupAutoBidding(teamId) {
    document.getElementById('autoBidBtn').addEventListener('click', function() {
      const maxBid = parseInt(document.getElementById('maxBidAmount').value);
      const priorityPlayers = Array.from(document.getElementById('priorityPlayers').selectedOptions)
        .map(option => option.value);
      
      if (maxBid) {
        // Listen for new players
        database.ref('config/currentPlayer').on('value', (snapshot) => {
          const currentPlayerId = snapshot.val();
          if (currentPlayerId) {
            database.ref('players/' + currentPlayerId).once('value').then((playerSnapshot) => {
              const player = playerSnapshot.val();
              
              // Check if player matches strategy
              if (priorityPlayers.includes(currentPlayerId) {
                const currentBid = player.currentBid || player.basePrice;
                const nextBid = currentBid + 1000000; // 1M increment
                
                if (nextBid <= maxBid) {
                  placeBid(currentPlayerId, teamId, nextBid);
                }
              }
            });
          }
        });
        
        this.textContent = 'Auto-Bid Active';
        this.classList.add('active');
      }
    });
  }