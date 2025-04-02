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