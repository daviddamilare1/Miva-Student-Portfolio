
    // Academic Planner

const TASKS_KEY = 'cos106_tasks';

    // Array to store tasks
let tasks = [];

    // DOM references
let taskInput, dueDateInput, prioritySelect, courseInput, taskList, emptyState;
let statTotal, statDone, statPending;

function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    tasks = saved ? JSON.parse(saved) : getSampleTasks();
  } catch {
    tasks = getSampleTasks();
  }
}

function saveTasks() {
  try { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); } catch {}
}

function getSampleTasks() {
  return [
    { id: 1, text: 'Complete HTML assignment – portfolio structure', course: 'COS 106', dueDate: '2025-08-10', priority: 'high', done: false, created: Date.now() },
    { id: 2, text: 'Review CSS Flexbox lecture notes', course: 'COS 106', dueDate: '2025-08-08', priority: 'medium', done: true, created: Date.now() - 86400000 },
    { id: 3, text: 'Submit group project proposal', course: 'COS 201', dueDate: '2025-08-15', priority: 'high', done: false, created: Date.now() - 172800000 },


  ];
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });


}

function isOverdue(dateStr, done) {
  if (!dateStr || done) return false;
  return new Date(dateStr + 'T00:00:00') < new Date();

}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' completed' : ''}`;
  li.dataset.id = task.id;

  const overdue = isOverdue(task.dueDate, task.done);
  const dueDateDisplay = task.dueDate
    ? `<span class="${overdue ? 'text-error' : ''}">${overdue ? '⚠ Overdue · ' : ''}Due ${formatDate(task.dueDate)}</span>`
    : '';
  const courseDisplay = task.course ? ` · ${task.course}` : '';

  li.innerHTML = `
    <button class="task-check${task.done ? ' done' : ''}" aria-label="Toggle complete" data-id="${task.id}"></button>
    <div class="task-info">
      <div class="task-text">${escapeHtml(task.text)}</div>
      <div class="task-meta">${dueDateDisplay}${courseDisplay}</div>
    </div>
    <span class="task-priority priority-${task.priority}">${task.priority}</span>
    <button class="task-delete" aria-label="Delete task" data-id="${task.id}">✕</button>
  `;
  return li;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;

}

function renderTasks(filter = 'all') {
  if (!taskList) return;
  taskList.innerHTML = '';

  let filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.done;
    if (filter === 'completed') return t.done;
    return true;


  });




      // Sort: incomplete first, then by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  filtered.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
  });

  if (filtered.length === 0 && emptyState) {
    emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    filtered.forEach(task => taskList.appendChild(createTaskElement(task)));
  }

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  if (statTotal) statTotal.textContent = total;
  if (statDone) statDone.textContent = done;
  if (statPending) statPending.textContent = pending;
}

function addTask() {
  if (!taskInput) return;
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    taskInput.style.borderColor = '#F87171';
    setTimeout(() => taskInput.style.borderColor = '', 1500);
    return;
  }

  const newTask = {
    id: generateId(),
    text,
    course: courseInput ? courseInput.value.trim() : '',
    dueDate: dueDateInput ? dueDateInput.value : '',
    priority: prioritySelect ? prioritySelect.value : 'medium',
    done: false,
    created: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();

  taskInput.value = '';
  if (dueDateInput) dueDateInput.value = '';
  if (courseInput) courseInput.value = '';
  if (prioritySelect) prioritySelect.value = 'medium';

      // Re-render with current filter
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  renderTasks(activeFilter);
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === Number(id));

  if (task) {
    task.done = !task.done;
    saveTasks();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderTasks(activeFilter);
  }

}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== Number(id));
  saveTasks();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  renderTasks(activeFilter);
}

function initPlanner() {
  taskInput = document.getElementById('taskInput');
  dueDateInput = document.getElementById('dueDateInput');
  prioritySelect = document.getElementById('prioritySelect');
  courseInput = document.getElementById('courseInput');
  taskList = document.getElementById('taskList');
  emptyState = document.getElementById('emptyState');
  statTotal = document.getElementById('statTotal');
  statDone = document.getElementById('statDone');
  statPending = document.getElementById('statPending');

  if (!taskList) return; // Not on planner page

  loadTasks();
  renderTasks();

      // Add task button
  const addBtn = document.getElementById('addTaskBtn');
  if (addBtn) addBtn.addEventListener('click', addTask);

      // Enter key in input
  if (taskInput) {
    taskInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') addTask();
    });
  }

            // Task list event delegation
  taskList.addEventListener('click', e => {
    const checkBtn = e.target.closest('.task-check');
    const delBtn = e.target.closest('.task-delete');

    if (checkBtn) toggleTask(checkBtn.dataset.id);
    if (delBtn) deleteTask(delBtn.dataset.id);
  });

      // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks(btn.dataset.filter);

    });

  });

      // Clear completed
  const clearBtn = document.getElementById('clearCompletedBtn');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => !t.done);
      saveTasks();
      renderTasks(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
      
    });
  }
}

document.addEventListener('DOMContentLoaded', initPlanner);
