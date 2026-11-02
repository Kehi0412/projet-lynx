const password = document.getElementById('password');
const toggle = document.getElementById('togglePassword');

toggle.addEventListener('click', function () {
  if (password.type === 'password') {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const matricule = document.getElementById('matricule').value;

  alert('Formulaire envoyé pour le matricule : ' + matricule);
});
