async function fetchServices() {
  const res = await fetch('/services');
  return res.json();
}

async function render() {
  const list = document.getElementById('list');
  list.innerHTML = '<p>Carregando...</p>';
  try {
    const data = await fetchServices();
    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = '<p>Nenhum serviço cadastrado.</p>';
      return;
    }
    list.innerHTML = data.map(s => `
      <div class="service">
        <strong>${s.name}</strong>
        <p>${s.description || ''}</p>
        <p>R$ ${s.price}</p>
        <p>${s.available ? 'Disponível' : 'Indisponível'}</p>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p>Erro ao carregar serviços.</p>';
  }
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = Number(document.getElementById('price').value);
  const available = document.getElementById('available').checked;

  try {
    const res = await fetch('/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, available })
    });
    if (!res.ok) throw new Error('Erro na criação');
    // limpar form
    document.getElementById('serviceForm').reset();
    await render();
    alert('Serviço criado');
  } catch (err) {
    alert('Erro ao criar serviço: ' + err.message);
  }
});

render();
