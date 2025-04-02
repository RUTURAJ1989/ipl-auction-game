// Initialize Firebase Auth
const auth = firebase.auth();

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-content').forEach(c => c.classList.remove('active'));
    
    this.classList.add('active');
    document.getElementById(this.dataset.tab + '-tab').classList.add('active');
  });
});

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Redirect based on user role
      checkUserRole(userCredential.user.uid);
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Registration
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const teamId = document.getElementById('registerTeam').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add user to database
      return database.ref('users/' + userCredential.user.uid).set({
        email: email,
        teamId: teamId,
        role: 'team'
      });
    })
    .then(() => {
      alert('Registration successful!');
      window.location.href = 'team.html';
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Check user role and redirect
function checkUserRole(userId) {
  database.ref('users/' + userId).once('value').then((snapshot) => {
    const user = snapshot.val();
    
    if (user) {
      switch(user.role) {
        case 'admin':
          window.location.href = 'admin.html';
          break;
        case 'team':
          window.location.href = 'team.html';
          break;
        default:
          window.location.href = 'index.html';
      }
    }
  });
}

// Populate teams dropdown
function loadTeamsForRegistration() {
  database.ref('teams').once('value').then((snapshot) => {
    const select = document.getElementById('registerTeam');
    select.innerHTML = '<option value="">Select Team</option>';
    
    snapshot.forEach((teamSnapshot) => {
      const team = teamSnapshot.val();
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = team.name;
      select.appendChild(option);
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadTeamsForRegistration);