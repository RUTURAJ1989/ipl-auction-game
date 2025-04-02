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