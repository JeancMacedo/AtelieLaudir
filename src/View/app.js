const editModal = new bootstrap.Modal(document.getElementById('editModal'));

// Font size controls
const FONT_KEY = 'atelie_font_size';
function applyFontSize(size) {
  document.documentElement.style.fontSize = size + 'px';
}
function getFontSize() {
  const v = localStorage.getItem(FONT_KEY);
  return v ? Number(v) : 16;
}
function setFontSize(size) {
  const final = Math.min(24, Math.max(12, size));
  localStorage.setItem(FONT_KEY, String(final));
  applyFontSize(final);
}
document.getElementById('btnFontIncrease').addEventListener('click', () => setFontSize(getFontSize() + 1));
document.getElementById('btnFontDecrease').addEventListener('click', () => setFontSize(getFontSize() - 1));
document.getElementById('btnFontReset').addEventListener('click', () => setFontSize(16));
// Apply persisted font size on load
applyFontSize(getFontSize());

// Daltonic mode (colorblind) control
const DALTON_KEY = 'atelie_dalton_mode';
function isDaltonic() {
  return localStorage.getItem(DALTON_KEY) === '1';
}
function setDaltonic(on) {
  if (on) {
    document.documentElement.classList.add('dalton-mode');
    localStorage.setItem(DALTON_KEY, '1');
    document.getElementById('btnColorblind').setAttribute('aria-pressed', 'true');
  } else {
    document.documentElement.classList.remove('dalton-mode');
    localStorage.removeItem(DALTON_KEY);
    document.getElementById('btnColorblind').setAttribute('aria-pressed', 'false');
  }
}
document.getElementById('btnColorblind').addEventListener('click', () => setDaltonic(!isDaltonic()));
// Apply persisted dalton mode on load
setDaltonic(isDaltonic());

async function fetchServices() {
  const res = await fetch('/services');
  return res.json();
}

function showAlert(message, type = 'success') {
  const area = document.getElementById('alertArea');
  area.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
  setTimeout(() => area.innerHTML = '', 4000);
}

async function render() {
  const tbody = document.getElementById('list');
  tbody.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
  try {
    const data = await fetchServices();
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Nenhum serviço cadastrado.</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(s => `
      <tr data-id="${s._id}">
        <td>${s.name}</td>
        <td>${(s.description || '').substring(0,120)}</td>
        <td>R$ ${Number(s.price).toFixed(2)}</td>
        <td>${s.available ? 'Sim' : 'Não'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${s._id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${s._id}">Excluir</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar serviços.</td></tr>';
  }
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = Number(document.getElementById('price').value);
  const available = document.getElementById('available').checked;

  try {
    const res = await fetch('/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, available })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro na criação');
    }
    document.getElementById('serviceForm').reset();
    showAlert('Serviço criado com sucesso', 'success');
    await render();
  } catch (err) {
    showAlert('Erro ao criar serviço: ' + err.message, 'danger');
  }
});

document.getElementById('btnClear').addEventListener('click', () => document.getElementById('serviceForm').reset());

// Delegate clicks for edit/delete
document.getElementById('servicesTable').addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-id');
  if (!id) return;
  if (e.target.classList.contains('btn-delete')) {
    if (!confirm('Confirma exclusão do serviço?')) return;
    try {
      const res = await fetch(`/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
      showAlert('Serviço removido', 'warning');
      await render();
    } catch (err) {
      showAlert('Erro ao deletar: ' + err.message, 'danger');
    }
  }
  if (e.target.classList.contains('btn-edit')) {
    try {
      const res = await fetch(`/services/${id}`);
      if (!res.ok) throw new Error('Erro ao buscar serviço');
      const s = await res.json();
      document.getElementById('editId').value = s._id;
      document.getElementById('editName').value = s.name;
      document.getElementById('editDescription').value = s.description || '';
      document.getElementById('editPrice').value = s.price;
      document.getElementById('editAvailable').checked = !!s.available;
      editModal.show();
    } catch (err) {
      showAlert('Erro ao abrir edição: ' + err.message, 'danger');
    }
  }
});

document.getElementById('saveEdit').addEventListener('click', async () => {
  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  const price = Number(document.getElementById('editPrice').value);
  const available = document.getElementById('editAvailable').checked;
  try {
    const res = await fetch(`/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, available })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao atualizar');
    }
    editModal.hide();
    showAlert('Serviço atualizado', 'success');
    await render();
  } catch (err) {
    showAlert('Erro ao atualizar: ' + err.message, 'danger');
  }
});

render();
