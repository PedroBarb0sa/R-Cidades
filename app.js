const STORAGE_KEY = 'r-cidades-cor-parceiros-v1';
const TODAY = '2026-10-15';
const STATUS_ORDER = ['Empresa identificada', 'Contato realizado', 'Interessada', 'Doação em negociação', 'Doação confirmada', 'Doação recebida', 'Doação registrada'];
const STATUS_SHORT = { 'Empresa identificada': 'Identificada', 'Contato realizado': 'Contato realizado', 'Interessada': 'Interessada', 'Doação em negociação': 'Em negociação', 'Doação confirmada': 'Confirmada', 'Doação recebida': 'Recebida', 'Doação registrada': 'Registrada' };
const initialData = {
  partners: [
    { id: 'p-aurora', name: 'Tintas Aurora', category: 'Tintas', contact: 'Marina Lopes', email: 'marina@tintasaurora.com.br', phone: '(47) 98821-4012', city: 'Joinville, SC', channel: 'WhatsApp', potential: 'Alto', notes: 'Possui linha de tintas para piso e sobras de obra.', updatedAt: '2026-10-14' },
    { id: 'p-constrular', name: 'Constrular Materiais', category: 'Construção', contact: 'Rafael Mendes', email: 'rafael@constrular.com.br', phone: '(47) 3025-9040', city: 'Joinville, SC', channel: 'Ligação', potential: 'Alto', notes: 'Avaliar doação de materiais complementares.', updatedAt: '2026-10-13' },
    { id: 'p-ferragem', name: 'Ferragem do Bairro', category: 'Ferramentas', contact: 'João Pedro', email: 'contato@ferragemdobairro.com.br', phone: '(47) 99102-1177', city: 'Araquari, SC', channel: 'Visita', potential: 'Médio', notes: 'Interesse em rolos, pincéis e bandejas.', updatedAt: '2026-10-11' },
    { id: 'p-transvale', name: 'Transvale Logística', category: 'Logística', contact: 'Carolina Reis', email: 'carolina@transvale.com.br', phone: '(47) 3344-1200', city: 'Joinville, SC', channel: 'E-mail', potential: 'Médio', notes: 'Pode apoiar o deslocamento dos materiais.', updatedAt: '2026-10-08' },
    { id: 'p-comunidade', name: 'Associação Morro da Boa Vista', category: 'Apoio comunitário', contact: 'Dona Celina', email: '', phone: '', city: 'Joinville, SC', channel: 'Indicação', potential: 'Alto', notes: 'Ponto de conexão com a comunidade.', updatedAt: '2026-10-06' },
    { id: 'p-casa-cor', name: 'Casa & Cor', category: 'Comércio local', contact: 'Eduardo Nunes', email: 'eduardo@casaecor.com.br', phone: '(47) 98810-5531', city: 'Joinville, SC', channel: 'WhatsApp', potential: 'Baixo', notes: 'Contato inicial para tintas coloridas.', updatedAt: '2026-10-04' }
  ],
  donations: [
    { id: 'd-001', partnerId: 'p-aurora', contactPerson: 'Marina Lopes', contactDate: '2026-10-14', material: 'Tinta para piso cinza · 18 L', quantity: '3 latas', status: 'Doação confirmada', deliveryDate: '2026-10-22', receivedDate: '', notes: 'Meta mínima da pintura da escadaria.' },
    { id: 'd-002', partnerId: 'p-constrular', contactPerson: 'Rafael Mendes', contactDate: '2026-10-13', material: 'Tinta acrílica colorida', quantity: '12 L', status: 'Doação em negociação', deliveryDate: '2026-10-28', receivedDate: '', notes: 'Aguardando confirmação das cores disponíveis.' },
    { id: 'd-003', partnerId: 'p-ferragem', contactPerson: 'João Pedro', contactDate: '2026-10-11', material: 'Rolos, pincéis e bandejas', quantity: '01 kit', status: 'Interessada', deliveryDate: '', receivedDate: '', notes: 'Retornar com lista consolidada.' },
    { id: 'd-004', partnerId: 'p-transvale', contactPerson: 'Carolina Reis', contactDate: '2026-10-08', material: 'Transporte dos materiais', quantity: '01 frete', status: 'Contato realizado', deliveryDate: '', receivedDate: '', notes: 'Apresentar rota e janela de coleta.' },
    { id: 'd-005', partnerId: 'p-comunidade', contactPerson: 'Dona Celina', contactDate: '2026-10-06', material: 'Lonas e luvas', quantity: '20 un.', status: 'Doação recebida', deliveryDate: '2026-10-12', receivedDate: '2026-10-12', notes: 'Material separado para o mutirão.' },
    { id: 'd-006', partnerId: 'p-casa-cor', contactPerson: 'Eduardo Nunes', contactDate: '2026-10-04', material: 'Tinta amarela e azul', quantity: '10 L', status: 'Empresa identificada', deliveryDate: '', receivedDate: '', notes: 'Primeiro contato a realizar.' },
    { id: 'd-007', partnerId: 'p-aurora', contactPerson: 'Marina Lopes', contactDate: '2026-10-02', material: 'Fundo preparador', quantity: '04 L', status: 'Doação registrada', deliveryDate: '2026-10-07', receivedDate: '2026-10-07', notes: 'Registrado no inventário de materiais.' }
  ]
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const clone = value => JSON.parse(JSON.stringify(value));

let state = loadState();
let currentView = 'dashboard';
let currentModal = null;
let toastTimer;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) { console.warn('Não foi possível ler os dados locais.', error); }
  return clone(initialData);
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { console.warn('Não foi possível salvar os dados locais.', error); }
}
function partnerById(id) { return state.partners.find(partner => partner.id === id); }
function formatDate(dateString, withYear = false) {
  if (!dateString) return '—';
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', ...(withYear ? { year: 'numeric' } : {}) }).format(date).replace('.', '');
}
function formatLongDate(dateString) {
  if (!dateString) return 'sem data';
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(date);
}
function statusClass(status) {
  if (status === 'Doação confirmada' || status === 'Doação recebida' || status === 'Doação registrada') return 'green';
  if (status === 'Doação em negociação' || status === 'Interessada') return 'yellow';
  return 'blue';
}
function showToast(message, type = 'success') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3300);
}
function navigate(view) {
  if (!document.querySelector(`#view-${view}`)) return;
  currentView = view;
  $$('.view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`));
  $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  const current = $(`.nav-item[data-view="${view}"]`);
  $('#breadcrumb-current').textContent = current ? current.querySelector('span:not(.nav-icon):not(.nav-count)')?.textContent || 'Visão geral' : 'Visão geral';
  window.location.hash = view === 'dashboard' ? '' : view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function getCounts() {
  const active = state.donations.filter(donation => !['Doação recebida', 'Doação registrada'].includes(donation.status)).length;
  const confirmed = state.donations.filter(donation => ['Doação confirmada', 'Doação recebida', 'Doação registrada'].includes(donation.status)).length;
  const contacted = state.donations.filter(donation => STATUS_ORDER.indexOf(donation.status) >= 1).length;
  const conversion = contacted ? Math.round((confirmed / contacted) * 100) : 0;
  return { active, confirmed, conversion };
}
function renderAll() {
  renderMetrics(); renderStageOverview(); renderActivity(); renderMaterials(); renderPipeline(); renderPartners(); updateDonationSelect();
  $('#nav-donation-count').textContent = String(state.donations.length).padStart(2, '0');
}
function renderMetrics() {
  const { active, confirmed, conversion } = getCounts();
  $('#metric-partners').textContent = state.partners.length;
  $('#metric-active').textContent = active;
  $('#metric-confirmed').textContent = confirmed;
  $('#metric-conversion').textContent = `${conversion}%`;
  $('#impact-confirmed').textContent = `R$ ${(confirmed * 780).toLocaleString('pt-BR')}`;
}
function renderStageOverview() {
  const stages = [
    { label: 'Em contato', statuses: ['Empresa identificada', 'Contato realizado'], color: '' },
    { label: 'Em conversa', statuses: ['Interessada', 'Doação em negociação'], color: 'yellow' },
    { label: 'Confirmadas', statuses: ['Doação confirmada'], color: 'coral' },
    { label: 'No inventário', statuses: ['Doação recebida', 'Doação registrada'], color: 'green' }
  ];
  $('#stage-overview').innerHTML = stages.map(stage => {
    const count = state.donations.filter(donation => stage.statuses.includes(donation.status)).length;
    return `<div class="stage-overview-item"><span class="stage-label">${stage.label}</span><b class="stage-number ${stage.color}">${String(count).padStart(2, '0')}</b><span class="muted-label">oportunidades</span></div>`;
  }).join('');
  $('#stage-progress').innerHTML = STATUS_ORDER.map((_, index) => `<span class="progress-segment ${index < 4 ? 'filled' : index === 4 ? 'partial' : ''}"></span>`).join('');
}
function renderActivity() {
  const recent = [...state.donations].sort((a, b) => b.contactDate.localeCompare(a.contactDate)).slice(0, 4);
  $('#activity-list').innerHTML = recent.map(donation => {
    const partner = partnerById(donation.partnerId);
    const iconClass = statusClass(donation.status);
    const verb = donation.status === 'Doação confirmada' ? 'confirmou' : donation.status === 'Doação recebida' ? 'recebeu' : donation.status === 'Doação registrada' ? 'registrou' : 'atualizou';
    return `<div class="activity-item"><div class="activity-icon icon-${iconClass === 'yellow' ? 'yellow' : iconClass === 'green' ? 'green' : 'blue'}">${iconClass === 'green' ? '✓' : '↗'}</div><div class="activity-text"><strong>${escapeHtml(partner?.name || 'Empresa')}</strong> ${verb} <b>${escapeHtml(donation.material.split(' · ')[0])}</b></div><span class="activity-time">${formatDate(donation.contactDate)}</span></div>`;
  }).join('');
}
function renderMaterials() {
  const targets = [
    { name: 'Tinta piso cinza', meta: '18 L · meta 54 L', value: 54, captured: state.donations.filter(d => d.material.toLowerCase().includes('cinza') && ['Doação confirmada','Doação recebida','Doação registrada'].includes(d.status)).length * 18, color: 'gray' },
    { name: 'Tintas coloridas', meta: 'cores para intervenção', value: 30, captured: state.donations.filter(d => d.material.toLowerCase().includes('color') || d.material.toLowerCase().includes('amarela') || d.material.toLowerCase().includes('azul')).length * 10, color: 'pink' },
    { name: 'Kit complementar', meta: 'rolos · pincéis · luvas', value: 4, captured: state.donations.filter(d => /rolos|luvas|lonas|kit/.test(d.material.toLowerCase())).length, color: 'tools' }
  ];
  $('#material-list').innerHTML = targets.map(item => `<div class="material-item"><div class="material-top"><span class="material-swatch swatch-${item.color}"></span><span class="muted-label">${Math.min(100, Math.round((item.captured / item.value) * 100))}%</span></div><strong>${item.name}</strong><p>${item.meta}</p><div class="material-progress"><span style="width:${Math.min(100, Math.max(8, Math.round((item.captured / item.value) * 100)))}%"></span></div></div>`).join('');
}
function renderPipeline() {
  const query = ($('#pipeline-search')?.value || '').toLowerCase().trim();
  const filter = $('#pipeline-filter')?.value || 'all';
  const matching = state.donations.filter(donation => {
    const partner = partnerById(donation.partnerId);
    const text = `${partner?.name || ''} ${donation.material || ''}`.toLowerCase();
    return (!query || text.includes(query)) && (filter === 'all' || donation.status === filter);
  });
  $('#pipeline-board').innerHTML = STATUS_ORDER.map((status, index) => {
    const cards = matching.filter(donation => donation.status === status);
    return `<article class="pipeline-column"><div class="column-heading"><h3>${status}</h3><span class="column-count">${cards.length}</span></div><div class="pipeline-cards">${cards.length ? cards.map(donationCard).join('') : '<div class="empty-column">Nenhum registro nesta etapa.<br /><span>O próximo avanço começa por um contato.</span></div>'}</div></article>`;
  }).join('');
}
function donationCard(donation) {
  const partner = partnerById(donation.partnerId);
  const index = STATUS_ORDER.indexOf(donation.status);
  const next = STATUS_ORDER[index + 1];
  return `<div class="donation-card" data-id="${donation.id}"><div class="donation-card-top"><span class="category-mini">${escapeHtml(partner?.category || 'Parceiro')}</span><button class="card-menu" data-action="edit-donation" data-id="${donation.id}" type="button" aria-label="Editar doação">•••</button></div><h4>${escapeHtml(partner?.name || 'Empresa não encontrada')}</h4><div class="material-line">${escapeHtml(donation.material)}<br /><b>${escapeHtml(donation.quantity)}</b></div><div class="donation-meta"><span>contato ${formatDate(donation.contactDate)}</span><b>${donation.deliveryDate ? formatDate(donation.deliveryDate) : 'sem previsão'}</b></div>${next ? `<button class="advance-button" data-action="advance-donation" data-id="${donation.id}" type="button">Avançar para ${STATUS_SHORT[next]} <span>→</span></button>` : '<div class="advance-button" style="background:var(--green-light);color:var(--green);text-align:center;">Fluxo concluído ✓</div>'}</div>`;
}
function renderPartners() {
  const query = ($('#partner-search')?.value || '').toLowerCase().trim();
  const category = $('#category-filter')?.value || 'all';
  const matching = state.partners.filter(partner => {
    const text = `${partner.name} ${partner.contact} ${partner.category}`.toLowerCase();
    return (!query || text.includes(query)) && (category === 'all' || partner.category === category);
  });
  $('#partner-count-title').textContent = `${matching.length} parceiro${matching.length === 1 ? '' : 's'} encontrado${matching.length === 1 ? '' : 's'}`;
  $('#partners-table').innerHTML = matching.length ? matching.map(partnerRow).join('') : '<tr><td colspan="6" class="empty-table">Nenhum parceiro encontrado com estes filtros.</td></tr>';
}
function partnerRow(partner) {
  const initials = partner.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  const palette = { Tintas: '', Construção: 'blue', Ferramentas: 'green', Logística: 'blue', 'Comércio local': 'yellow', 'Apoio comunitário': 'green' };
  const paletteClass = palette[partner.category] || '';
  const related = state.donations.filter(donation => donation.partnerId === partner.id).sort((a, b) => b.contactDate.localeCompare(a.contactDate))[0];
  return `<tr><td><div class="company-cell"><span class="company-avatar ${paletteClass}">${escapeHtml(initials)}</span><div><strong>${escapeHtml(partner.name)}</strong><small>${escapeHtml(partner.city || 'cidade não informada')}</small></div></div></td><td><span class="category-pill">${escapeHtml(partner.category)}</span></td><td>${escapeHtml(partner.contact)}</td><td><span class="legend-dot ${related ? 'green' : 'yellow'}"></span> ${related ? formatDate(related.contactDate, true) : 'sem contato'}</td><td><span class="potential-pill ${partner.potential.toLowerCase()}">${escapeHtml(partner.potential)}</span></td><td><div class="row-actions"><button class="row-action" data-action="edit-partner" data-id="${partner.id}" type="button" aria-label="Editar ${escapeHtml(partner.name)}">✎</button><button class="row-action" data-action="delete-partner" data-id="${partner.id}" type="button" aria-label="Excluir ${escapeHtml(partner.name)}">×</button></div></td></tr>`;
}
function updateDonationSelect() {
  const select = $('#donation-form-fields select[name="partnerId"]');
  if (!select) return;
  const selected = select.value;
  select.innerHTML = '<option value="">Selecione um parceiro</option>' + state.partners.map(partner => `<option value="${partner.id}">${escapeHtml(partner.name)}</option>`).join('');
  if (selected) select.value = selected;
}
function updateStatusSelect() {
  const select = $('#donation-form-fields select[name="status"]');
  select.innerHTML = STATUS_ORDER.map(status => `<option>${status}</option>`).join('');
}
function setSectionDisabled(sectionSelector, disabled) {
  $$(sectionSelector + ' input, ' + sectionSelector + ' select, ' + sectionSelector + ' textarea').forEach(control => { control.disabled = disabled; });
}
function resetModal() {
  const form = $('#modal-form');
  form.reset();
  $('#partner-form-fields').hidden = false;
  $('#donation-form-fields').hidden = true;
  setSectionDisabled('#partner-form-fields', false);
  setSectionDisabled('#donation-form-fields', true);
  $('#modal-kicker').textContent = 'NOVO REGISTRO';
  $('#modal-title').textContent = 'Cadastrar parceiro';
  $('#modal-description').textContent = 'Comece com o essencial. Os campos marcados com * são obrigatórios.';
  $('#modal-submit').textContent = 'Salvar parceiro';
  currentModal = null;
}
function openPartnerModal(partner = null) {
  resetModal();
  currentModal = { type: 'partner', id: partner?.id || null };
  if (partner) {
    $('#modal-kicker').textContent = 'EDITAR CADASTRO'; $('#modal-title').textContent = 'Atualizar parceiro'; $('#modal-submit').textContent = 'Salvar alterações';
    const form = $('#modal-form');
    Object.entries({ name: partner.name, category: partner.category, contact: partner.contact, email: partner.email, phone: partner.phone, city: partner.city, channel: partner.channel, potential: partner.potential, notes: partner.notes }).forEach(([name, value]) => { if (form.elements[name]) form.elements[name].value = value || ''; });
  }
  showModal();
}
function openDonationModal(donation = null) {
  resetModal();
  currentModal = { type: 'donation', id: donation?.id || null };
  $('#partner-form-fields').hidden = true; $('#donation-form-fields').hidden = false;
  setSectionDisabled('#partner-form-fields', true);
  setSectionDisabled('#donation-form-fields', false);
  $('#modal-kicker').textContent = donation ? 'EDITAR DOAÇÃO' : 'NOVO REGISTRO'; $('#modal-title').textContent = donation ? 'Atualizar doação' : 'Registrar doação'; $('#modal-description').textContent = 'Acompanhe material, quantidade, etapa e logística em um só registro.'; $('#modal-submit').textContent = donation ? 'Salvar alterações' : 'Salvar doação';
  updateDonationSelect(); updateStatusSelect();
  const form = $('#modal-form');
  form.elements.contactDate.value = donation?.contactDate || TODAY;
  form.elements.status.value = donation?.status || 'Empresa identificada';
  if (donation) { form.elements.partnerId.value = donation.partnerId; form.elements.donationContact.value = donation.contactPerson; form.elements.material.value = donation.material; form.elements.quantity.value = donation.quantity; form.elements.deliveryDate.value = donation.deliveryDate; form.elements.receivedDate.value = donation.receivedDate; form.elements.donationNotes.value = donation.notes; }
  showModal();
}
function showModal() { $('#modal-backdrop').hidden = false; document.body.style.overflow = 'hidden'; setTimeout(() => $('.modal input, .modal select')?.focus(), 40); }
function closeModal() { $('#modal-backdrop').hidden = true; document.body.style.overflow = ''; resetModal(); }
function handleModalSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  if (currentModal?.type === 'partner') {
    const existing = currentModal.id ? partnerById(currentModal.id) : null;
    const partner = { id: existing?.id || makeId('p'), name: values.name.trim(), category: values.category, contact: values.contact.trim(), email: values.email.trim(), phone: values.phone.trim(), city: values.city.trim(), channel: values.channel, potential: values.potential, notes: values.notes.trim(), updatedAt: TODAY };
    if (existing) state.partners = state.partners.map(item => item.id === existing.id ? partner : item); else state.partners.unshift(partner);
    saveState(); renderAll(); closeModal(); showToast(existing ? 'Parceiro atualizado.' : 'Parceiro cadastrado.');
  } else if (currentModal?.type === 'donation') {
    const existing = currentModal.id ? state.donations.find(item => item.id === currentModal.id) : null;
    const donation = { id: existing?.id || makeId('d'), partnerId: values.partnerId, contactPerson: values.donationContact.trim(), contactDate: values.contactDate, material: values.material.trim(), quantity: values.quantity.trim(), status: values.status, deliveryDate: values.deliveryDate, receivedDate: values.receivedDate, notes: values.donationNotes.trim() };
    if (existing) state.donations = state.donations.map(item => item.id === existing.id ? donation : item); else state.donations.unshift(donation);
    saveState(); renderAll(); closeModal(); showToast(existing ? 'Doação atualizada.' : 'Doação registrada.');
  }
}
function advanceDonation(id) {
  const donation = state.donations.find(item => item.id === id);
  if (!donation) return;
  const nextIndex = STATUS_ORDER.indexOf(donation.status) + 1;
  if (nextIndex >= STATUS_ORDER.length) return;
  donation.status = STATUS_ORDER[nextIndex];
  if (donation.status === 'Doação recebida' && !donation.receivedDate) donation.receivedDate = TODAY;
  saveState(); renderAll(); showToast(`Status avançado para “${STATUS_SHORT[donation.status]}”.`);
}
function deletePartner(id) {
  const partner = partnerById(id);
  if (!partner) return;
  if (!window.confirm(`Excluir o cadastro de ${partner.name}? As doações relacionadas serão mantidas.`)) return;
  state.partners = state.partners.filter(item => item.id !== id); saveState(); renderAll(); showToast('Cadastro excluído.', 'success');
}
function bindEvents() {
  document.addEventListener('click', event => {
    const viewTrigger = event.target.closest('[data-view]');
    if (viewTrigger) { event.preventDefault(); navigate(viewTrigger.dataset.view); return; }
    const action = event.target.closest('[data-action]');
    if (action) {
      const { action: actionName, id } = action.dataset;
      if (actionName === 'advance-donation') advanceDonation(id);
      if (actionName === 'edit-donation') openDonationModal(state.donations.find(item => item.id === id));
      if (actionName === 'edit-partner') openPartnerModal(partnerById(id));
      if (actionName === 'delete-partner') deletePartner(id);
    }
  });
  $('#new-partner').addEventListener('click', () => openPartnerModal()); $('#quick-new-donation').addEventListener('click', () => openDonationModal()); $('#pipeline-new-donation').addEventListener('click', () => openDonationModal());
  $('#partner-search').addEventListener('input', renderPartners); $('#category-filter').addEventListener('change', renderPartners); $('#pipeline-search').addEventListener('input', renderPipeline); $('#pipeline-filter').addEventListener('change', renderPipeline);
  $('#reset-data').addEventListener('click', () => { if (!window.confirm('Restaurar os dados de demonstração? Seus cadastros locais serão substituídos.')) return; state = clone(initialData); saveState(); renderAll(); showToast('Demonstração restaurada.'); });
  $('#modal-form').addEventListener('submit', handleModalSubmit); $('#modal-close').addEventListener('click', closeModal); $('#modal-cancel').addEventListener('click', closeModal); $('#modal-backdrop').addEventListener('click', event => { if (event.target.id === 'modal-backdrop') closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#modal-backdrop').hidden) closeModal(); });
}
function init() {
  updateStatusSelect(); bindEvents(); renderAll();
  const hashView = window.location.hash.replace('#', ''); if (hashView && document.querySelector(`#view-${hashView}`)) navigate(hashView);
}
init();
