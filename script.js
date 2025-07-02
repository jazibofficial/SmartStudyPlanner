// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
if (localStorage.getItem('theme') === 'dark') body.classList.add('dark');
themeToggle.onclick = () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
};
themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';

// --- Task Management ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `<span>${task.text}</span>
            <div>
                <button class="complete-btn">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>`;
        li.querySelector('.complete-btn').onclick = () => {
            tasks[i].completed = !tasks[i].completed;
            saveTasks();
        };
        li.querySelector('.edit-btn').onclick = () => {
            const newText = prompt('Edit task:', task.text);
            if (newText) {
                tasks[i].text = newText;
                saveTasks();
            }
        };
        li.querySelector('.delete-btn').onclick = () => {
            tasks.splice(i, 1);
            saveTasks();
        };
        taskList.appendChild(li);
    });
}
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}
taskForm.onsubmit = e => {
    e.preventDefault();
    if (taskInput.value.trim()) {
        tasks.push({ text: taskInput.value.trim(), completed: false });
        saveTasks();
        taskInput.value = '';
    }
};
renderTasks();

// --- Exam Countdown ---
const examForm = document.getElementById('exam-form');
const examDateInput = document.getElementById('exam-date');
const countdownDiv = document.getElementById('countdown');
let examDate = localStorage.getItem('examDate');
if (examDate) examDateInput.value = examDate;
function updateCountdown() {
    if (!examDate) { countdownDiv.textContent = 'No exam date set.'; return; }
    const now = new Date();
    const exam = new Date(examDate);
    const diff = exam - now;
    if (diff <= 0) {
        countdownDiv.textContent = 'Exam time! Good luck!';
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    countdownDiv.textContent = `${days}d ${hours}h ${mins}m ${secs}s left`;
}
examForm.onsubmit = e => {
    e.preventDefault();
    examDate = examDateInput.value;
    localStorage.setItem('examDate', examDate);
    updateCountdown();
};
setInterval(updateCountdown, 1000);
updateCountdown();

// --- Subject Notes ---
const noteForm = document.getElementById('note-form');
const subjectInput = document.getElementById('subject-input');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, i) => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `<strong>${note.subject}</strong><p>${note.text}</p>
            <div class="note-actions">
                <button class="edit-note">Edit</button>
                <button class="delete-note">Delete</button>
            </div>`;
        card.querySelector('.edit-note').onclick = () => {
            const newSubject = prompt('Edit subject:', note.subject);
            const newText = prompt('Edit note:', note.text);
            if (newSubject && newText) {
                notes[i] = { subject: newSubject, text: newText };
                saveNotes();
            }
        };
        card.querySelector('.delete-note').onclick = () => {
            notes.splice(i, 1);
            saveNotes();
        };
        notesList.appendChild(card);
    });
}
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}
noteForm.onsubmit = e => {
    e.preventDefault();
    if (subjectInput.value.trim() && noteInput.value.trim()) {
        notes.push({ subject: subjectInput.value.trim(), text: noteInput.value.trim() });
        saveNotes();
        subjectInput.value = '';
        noteInput.value = '';
    }
};
renderNotes();

// --- AI Cursor Assistant ---
const aiTooltip = document.getElementById('ai-cursor-tooltip');
const aiIcon = document.getElementById('ai-cursor-icon');
const tooltips = {
    '#task-input': 'Add your daily study tasks here!',
    '#exam-date': 'Set your next exam date for countdown.',
    '#subject-input': 'Enter the subject for your notes.',
    '#note-input': 'Write your notes for this subject.',
    '#theme-toggle': 'Switch between light and dark mode.',
    '#ai-cursor-icon': 'I am your AI study buddy! Hover for tips.'
};
function showTooltip(text, x, y) {
    aiTooltip.textContent = text;
    aiTooltip.style.left = x + 20 + 'px';
    aiTooltip.style.top = y + 20 + 'px';
    aiTooltip.classList.add('visible');
    aiTooltip.classList.remove('hidden');
}
function hideTooltip() {
    aiTooltip.classList.remove('visible');
    aiTooltip.classList.add('hidden');
}
Object.keys(tooltips).forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
        el.addEventListener('mouseenter', e => {
            showTooltip(tooltips[selector], e.clientX, e.clientY);
        });
        el.addEventListener('mousemove', e => {
            showTooltip(tooltips[selector], e.clientX, e.clientY);
        });
        el.addEventListener('mouseleave', hideTooltip);
    }
});
// Idle prompt after 15s
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        showTooltip('Need help? Hover over icons for tips!', window.innerWidth/2, 80);
        setTimeout(hideTooltip, 4000);
    }, 15000);
}
document.onmousemove = resetIdleTimer;
document.onkeydown = resetIdleTimer;
resetIdleTimer(); 