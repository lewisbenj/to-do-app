 class TodoApp {
            constructor() {
                this.todos = JSON.parse(localStorage.getItem('todos')) || [];
                this.currentFilter = 'all';
                this.init();
                this.createFloatingParticles();
            }

            init() {
                this.bindEvents();
                this.render();
                this.updateStats();
            }

            bindEvents() {
                const addBtn = document.getElementById('addBtn');
                const todoInput = document.getElementById('todoInput');
                const filterTabs = document.querySelectorAll('.filter-tab');

                addBtn.addEventListener('click', () => this.addTodo());
                todoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTodo();
                });

                filterTabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        filterTabs.forEach(t => t.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentFilter = e.target.dataset.filter;
                        this.render();
                    });
                });
            }

            addTodo() {
                const input = document.getElementById('todoInput');
                const text = input.value.trim();

                if (!text) {
                    this.shakeInput(input);
                    return;
                }

                const todo = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    createdAt: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };

                this.todos.unshift(todo);
                this.saveTodos();
                input.value = '';
                this.render();
                this.updateStats();
                this.animateAdd();
            }

            toggleTodo(id) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.completed = !todo.completed;
                    this.saveTodos();
                    this.updateStats();
                    this.render();
                }
            }

            deleteTodo(id) {
                const index = this.todos.findIndex(t => t.id === id);
                if (index > -1) {
                    const todoElement = document.querySelector(`[data-id="${id}"]`);
                    this.animateDelete(todoElement, () => {
                        this.todos.splice(index, 1);
                        this.saveTodos();
                        this.render();
                        this.updateStats();
                    });
                }
            }

            getFilteredTodos() {
                switch (this.currentFilter) {
                    case 'completed':
                        return this.todos.filter(todo => todo.completed);
                    case 'pending':
                        return this.todos.filter(todo => !todo.completed);
                    default:
                        return this.todos;
                }
            }

            render() {
                const todoList = document.getElementById('todoList');
                const filteredTodos = this.getFilteredTodos();

                if (filteredTodos.length === 0) {
                    const emptyMessage = this.currentFilter === 'completed' ? 
                        'Chưa hoàn thành công việc nào!' : 
                        this.currentFilter === 'pending' ? 
                        'Tuyệt vời! Đã hoàn thành tất cả!' :
                        'Chưa có công việc nào. Hãy thêm công việc đầu tiên!';
                    
                    todoList.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">📝</div>
                            <p>${emptyMessage}</p>
                        </div>
                    `;
                    return;
                }

                todoList.innerHTML = filteredTodos.map(todo => `
                    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                        <label class="todo-checkbox">
                            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                                   onchange="app.toggleTodo(${todo.id})">
                            <span class="checkmark"></span>
                        </label>
                        <span class="todo-text">${todo.text}</span>
                        <span class="todo-time">${todo.createdAt}</span>
                        <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                            Xóa
                        </button>
                    </div>
                `).join('');
            }

            updateStats() {
                const total = this.todos.length;
                const completed = this.todos.filter(t => t.completed).length;
                const pending = total - completed;

                document.getElementById('totalTasks').textContent = total;
                document.getElementById('completedTasks').textContent = completed;
                document.getElementById('pendingTasks').textContent = pending;

                // Animate numbers
                document.querySelectorAll('.stat-number').forEach(el => {
                    el.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, 200);
                });
            }

            saveTodos() {
                localStorage.setItem('todos', JSON.stringify(this.todos));
            }

            shakeInput(input) {
                input.style.animation = 'none';
                setTimeout(() => {
                    input.style.animation = 'shake 0.5s ease-in-out';
                }, 10);
            }

            animateAdd() {
                const addBtn = document.getElementById('addBtn');
                addBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    addBtn.style.transform = 'scale(1)';
                }, 150);
            }

            animateDelete(element, callback) {
                element.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(callback, 300);
            }

            createFloatingParticles() {
                const particlesContainer = document.querySelector('.floating-particles');
                const particleCount = 15;

                for (let i = 0; i < particleCount; i++) {
                    setTimeout(() => {
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.left = Math.random() * 100 + '%';
                        particle.style.animationDelay = Math.random() * 4 + 's';
                        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                        particlesContainer.appendChild(particle);

                        setTimeout(() => {
                            particle.remove();
                        }, 7000);
                    }, i * 300);
                }

                // Tạo particles mới liên tục
                setInterval(() => {
                    this.createFloatingParticles();
                }, 8000);
            }
        }

        // CSS cho animation shake và slideOut
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes slideOut {
                0% { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateX(-100%) scale(0.8); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);

        // Khởi tạo ứng dụng
        const app = new TodoApp();