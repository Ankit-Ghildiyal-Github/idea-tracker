// Utilities for Local Storage
function getIdeas() {
  return JSON.parse(localStorage.getItem('ideas') || '[]');
}
function saveIdeas(ideas) {
  localStorage.setItem('ideas', JSON.stringify(ideas));
}

// Render Ideas
function renderIdeas() {
  const ideas = getIdeas();
  const ideasList = document.getElementById('ideasList');
  ideasList.innerHTML = '';
  if (ideas.length === 0) {
    ideasList.innerHTML = '<div class="col-12 text-center text-muted">No ideas yet. Add your first idea!</div>';
    return;
  }
  ideas.forEach((idea, idx) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${escapeHTML(idea.title)}</h5>
          <p class="card-text">${escapeHTML(idea.desc)}</p>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editIdea(${idx})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteIdea(${idx})">Delete</button>
        </div>
      </div>
    `;
    ideasList.appendChild(col);
  });
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

// Add Idea
document.getElementById('ideaForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('ideaTitle').value.trim();
  const desc = document.getElementById('ideaDesc').value.trim();
  if (!title || !desc) return;
  const ideas = getIdeas();
  ideas.push({ title, desc });
  saveIdeas(ideas);
  this.reset();
  renderIdeas();
});

// Delete Idea
window.deleteIdea = function(idx) {
  if (!confirm('Delete this idea?')) return;
  const ideas = getIdeas();
  ideas.splice(idx, 1);
  saveIdeas(ideas);
  renderIdeas();
};

// Edit Idea
window.editIdea = function(idx) {
  const ideas = getIdeas();
  const idea = ideas[idx];
  document.getElementById('editId').value = idx;
  document.getElementById('editTitle').value = idea.title;
  document.getElementById('editDesc').value = idea.desc;
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
};

// Save Edited Idea
document.getElementById('editForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const idx = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value.trim();
  const desc = document.getElementById('editDesc').value.trim();
  if (!title || !desc) return;
  const ideas = getIdeas();
  ideas[idx] = { title, desc };
  saveIdeas(ideas);
  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
  renderIdeas();
});

// Initial render
renderIdeas();