const form = document.getElementById('login-form');
const errorEl = document.getElementById('login-error');

db.auth.getSession().then(({ data: { session } }) => {
  if (session) window.location.href = 'index.html';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  const email = form.email.value.trim();
  const password = form.password.value;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Sign in';
  } else {
    window.location.href = 'index.html';
  }
});
