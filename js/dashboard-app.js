const PLANS = {
  free: { label: 'Free',              color: '#6b7280' },
  t1:   { label: 'T1 · Storefront',  color: '#4cd7f6' },
  t2:   { label: 'T2 · Informed',    color: '#adc6ff' },
  t3:   { label: 'T3 · Autonomous',  color: '#c4b5fd' },
};

// ── Auth guard ──────────────────────────────────────────────────────────────
let currentUser = null;

async function init() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }
  currentUser = session.user;
  document.getElementById('user-email').textContent = currentUser.user_metadata?.display_name || currentUser.email;
  loadClients();
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'login.html';
});

// ── Data ────────────────────────────────────────────────────────────────────
async function loadClients() {
  const { data: clients, error } = await db
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  renderKPIs(clients);
  renderTable(clients);
}

function renderKPIs(clients) {
  const active = clients.filter(c => c.status === 'active');
  const mrr = active.reduce((sum, c) => sum + Number(c.monthly_amount), 0);
  document.getElementById('kpi-total').textContent = clients.length;
  document.getElementById('kpi-active').textContent = active.length;
  document.getElementById('kpi-mrr').textContent =
    '$' + mrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderTable(clients) {
  const tbody = document.getElementById('clients-tbody');
  if (!clients.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No clients yet — add your first one.</td></tr>';
    return;
  }
  tbody.innerHTML = clients.map(c => {
    const plan = PLANS[c.plan] || PLANS.free;
    const statusClass = { active: 'status-active', paused: 'status-paused', inactive: 'status-inactive' }[c.status] || '';
    const monthly = Number(c.monthly_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return `
      <tr>
        <td>
          <div class="client-name">${esc(c.name)}</div>
          <div class="client-biz">${esc(c.business_name)}</div>
        </td>
        <td><span class="plan-badge" style="--plan-color:${plan.color}">${plan.label}</span></td>
        <td>${monthly}</td>
        <td>${esc(c.email || '—')}</td>
        <td>${esc(c.phone || '—')}</td>
        <td><span class="status-badge ${statusClass}">${c.status}</span></td>
        <td>
          <button class="action-btn" onclick="openEdit('${c.id}')">Edit</button>
          <button class="action-btn action-btn-del" onclick="deleteClient('${c.id}')">Delete</button>
        </td>
      </tr>`;
  }).join('');
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Modal ───────────────────────────────────────────────────────────────────
let editingId = null;
const modal      = document.getElementById('client-modal');
const modalTitle = document.getElementById('modal-title');
const clientForm = document.getElementById('client-form');

document.getElementById('add-client-btn').addEventListener('click', () => openModal());
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function openModal(data = null) {
  editingId = data ? data.id : null;
  modalTitle.textContent = data ? 'Edit Client' : 'Add Client';
  clientForm.reset();
  if (data) {
    clientForm.name.value           = data.name           || '';
    clientForm.email.value          = data.email          || '';
    clientForm.phone.value          = data.phone          || '';
    clientForm.business_name.value  = data.business_name  || '';
    clientForm.plan.value           = data.plan           || 'free';
    clientForm.monthly_amount.value = data.monthly_amount || '';
    clientForm.setup_fee.value      = data.setup_fee      || '';
    clientForm.start_date.value     = data.start_date     || '';
    clientForm.status.value         = data.status         || 'active';
    clientForm.website_url.value    = data.website_url    || '';
    clientForm.notes.value          = data.notes          || '';
  }
  modal.classList.add('open');
}

async function openEdit(id) {
  const { data, error } = await db.from('clients').select('*').eq('id', id).single();
  if (!error) openModal(data);
}

function closeModal() {
  modal.classList.remove('open');
  editingId = null;
}

clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = clientForm.querySelector('button[type="submit"]');
  btn.disabled = true;

  const payload = {
    name:           clientForm.name.value.trim(),
    email:          clientForm.email.value.trim()         || null,
    phone:          clientForm.phone.value.trim()         || null,
    business_name:  clientForm.business_name.value.trim(),
    plan:           clientForm.plan.value,
    monthly_amount: parseFloat(clientForm.monthly_amount.value) || 0,
    setup_fee:      parseFloat(clientForm.setup_fee.value)      || 0,
    start_date:     clientForm.start_date.value           || null,
    status:         clientForm.status.value,
    website_url:    clientForm.website_url.value.trim()   || null,
    notes:          clientForm.notes.value.trim()         || null,
  };

  const { error } = editingId
    ? await db.from('clients').update(payload).eq('id', editingId)
    : await db.from('clients').insert(payload);

  btn.disabled = false;
  if (error) { alert('Error: ' + error.message); return; }
  closeModal();
  loadClients();
});

async function deleteClient(id) {
  if (!confirm('Delete this client? This cannot be undone.')) return;
  const { error } = await db.from('clients').delete().eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  loadClients();
}

init();
