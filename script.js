name=script.js
let tasks = [];
let currentFilter = 'all';

// Load tasks from local storage on page load
window.addEventListener('load', function() {
    loadTasks();
    renderTasks();
});

// Add task on Enter key
function handleKeyPress(event) {
    if(event.key === 'Enter') {
        addTask();
    }
}

// Add new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if(taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if(task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTasks();
}

// Clear all tasks
function clearAllTasks() {
    if(confirm('Are you sure? This will delete all tasks!')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Render tasks to DOM
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const clearBtn = document.querySelector('.clear-all-btn');

    taskList.innerHTML = '';

    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if(currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if(currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    // Render each task
    if(filteredTasks.length === 0) {
        emptyState.classList.add('show');
        clearBtn.classList.add('hidden');
    } else {
        emptyState.classList.remove('show');
        clearBtn.classList.remove('hidden');

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="task-delete" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            `;
            taskList.appendChild(li);
        });
    }

    // Update statistics
    updateStats();
}

// Update statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
