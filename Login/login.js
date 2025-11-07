document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  if (email === '' || password === '') {
    errorMsg.textContent = 'Please enter both email and password.';
    errorMsg.classList.remove('hidden');
    return;
  }

  // Simulate successful login
  if (email === 'test@jiit.ac.in' && password === '123456') {
    alert('Login successful!');
    window.location.href = 'index.html'; // Redirect to home after login
  } else {
    errorMsg.textContent = 'Invalid credentials. Please try again.';
    errorMsg.classList.remove('hidden');
  }
});
