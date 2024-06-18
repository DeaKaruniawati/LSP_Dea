/**
 * Inisialisasi daftar tugas dari localStorage.
 * @type {Array<object>}
 */
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

/**
 * Memperbarui waktu dan tanggal saat ini dalam elemen HTML.
 */
function updateDateTime() {
    /**
     * Objek Date yang mewakili tanggal dan waktu saat ini.
     * @type {Date}
     */
    const currentDate = new Date();

    /**
     * Mendapatkan tanggal (hari) dari objek Date saat ini.
     * @type {number}
     */
    const day = currentDate.getDate();

    /**
     * Mendapatkan bulan (dalam bentuk angka 1-12) dari objek Date saat ini.
     * @type {number}
     */
    const month = currentDate.getMonth() + 1;

    /**
     * Mendapatkan tahun (empat digit) dari objek Date saat ini.
     * @type {number}
     */
    const year = currentDate.getFullYear();

    /**
     * Mendapatkan jam (dalam format 24 jam) dari objek Date saat ini.
     * @type {number}
     */
    const hours = currentDate.getHours();

    /**
     * Mendapatkan menit dari objek Date saat ini.
     * @type {number}
     */
    const minutes = currentDate.getMinutes();

    /**
     * Mendapatkan detik dari objek Date saat ini.
     * @type {number}
     */
    const seconds = currentDate.getSeconds();

    // Menampilkan tanggal dan waktu dalam elemen HTML 
    document.getElementById('current-date').textContent = `${day}/${month}/${year}`;
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
}

/**
 * Menambahkan tugas baru ke daftar tugas.
 */
function addTask() {
    const calendarInput = document.getElementById('due-date');
    calendarInput.style.display = 'block';

    /**
     * Elemen input untuk subject.
     * @type {HTMLInputElement}
     */
    const subjectInput = document.getElementById('subject');

    /**
     * Elemen input untuk task.
     * @type {HTMLInputElement}
     */
    const taskInput = document.getElementById('task');

    /**
     * Nilai dari input kalender.
     * @type {string}
     */
    const dueDate = calendarInput.value;

    /**
     * Nilai dari input subject setelah di-trim.
     * @type {string}
     */
    const subject = subjectInput.value.trim();

    /**
     * Nilai dari input task setelah di-trim.
     * @type {string}
     */
    const taskText = taskInput.value.trim();

    /**
     * Nomor tugas baru yang akan ditambahkan.
     * @type {number}
     */
    const number = tasks.length + 1;

    if (dueDate === '') {
        alert('Silakan pilih tanggal tenggat waktu sebelum menambahkan tugas baru.');
        return;
    }

    if (subject !== '' && taskText !== '') {
        const newTask = { id: Date.now(), dueDate, subject, text: taskText, completed: false, number };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        subjectInput.value = '';
        taskInput.value = '';
        calendarInput.style.display = 'block';
        clearInputs();
        loadTasks();
    } else {
        alert('Silakan isi kedua input (Mata Pelajaran dan Tambahkan Catatan) sebelum menambahkan tugas baru.');
    }
}

/**
 * Mengubah status selesai atau belum selesai dari sebuah tugas.
 * @param {number} id - ID dari tugas yang akan diubah statusnya.
 */
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

/**
 * Memuat tugas dari localStorage dan menampilkannya dalam tabel tugas.
 */
function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    /**
     * Nilai dari input filter.
     * @type {string}
     */
    const filterValue = document.getElementById('filter').value;

    /**
     * Kata kunci pencarian.
     * @type {string}
     */
    const searchText = document.getElementById('search').value.toLowerCase();

    tasks.forEach(task => {
        if ((filterValue === 'all' || (filterValue === 'completed' && task.completed) || (filterValue === 'not-completed' && !task.completed))
            && (task.subject.toLowerCase().includes(searchText) || task.text.toLowerCase().includes(searchText))) {
            const row = document.createElement('tr');
            row.className = task.completed ? 'completed' : '';
            row.innerHTML = `
                <td>${task.number}</td>
                <td>${task.dueDate}</td>
                <td>${task.subject}</td>
                <td>${task.text}</td>
                <td>${task.completed ? 'Selesai' : 'Belum Selesai'}</td>
                <td>
                    <i class="fas fa-check-circle action-icon" onclick="toggleComplete(${task.id})" style="color: ${task.completed ? '#4caf50' : '#aaa'};"></i>
                    <i class="fas fa-edit action-icon" onclick="editTaskPrompt(${task.id})"></i>
                    <i class="fas fa-trash-alt action-icon" onclick="deleteTaskPrompt(${task.id})"></i>
                </td>
            `;
            taskList.appendChild(row);
        }
    });
}

/**
 * Mengurutkan daftar tugas berdasarkan tanggal.
 */
function sortTasks() {
    const sortValue = document.getElementById('sort').value;

    if (sortValue === 'newest') {
        tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sortValue === 'oldest') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

/**
 * Mengedit teks tugas menggunakan modal.
 * @param {number} id - ID dari tugas yang akan diubah.
 */
function editTaskPrompt(id) {
    const task = tasks.find(task => task.id === id);

    if (task) {
        document.getElementById('editSubject').value = task.subject;
        document.getElementById('editText').value = task.text;
        document.getElementById('editDueDate').value = task.dueDate;

        const modal = document.getElementById('editTaskModal');
        modal.style.display = 'block';

        modal.setAttribute('data-task-id', id);

        document.getElementsByClassName('close')[0].onclick = function () {
            modal.style.display = 'none';
        }
    }
}

/**
 * Menyimpan perubahan pada tugas yang telah diedit.
 */
function saveEditedTask() {
    const editSubjectValue = document.getElementById('editSubject').value.trim();
    const editTextValue = document.getElementById('editText').value.trim();
    const editDueDateValue = document.getElementById('editDueDate').value;
    const taskId = document.getElementById('editTaskModal').getAttribute('data-task-id');

    tasks = tasks.map(task => {
        if (task.id === parseInt(taskId)) {
            task.subject = editSubjectValue;
            task.text = editTextValue;
            task.dueDate = editDueDateValue;
        }
        return task;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();

    document.getElementById('editTaskModal').style.display = 'none';
}

/**
 * Menghapus tugas dengan konfirmasi.
 * @param {number} id - ID dari tugas yang akan dihapus.
 */
function deleteTaskPrompt(id) {
    if (confirm("Anda yakin ingin menghapus tugas ini?")) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

/**
 * Mencari tugas berdasarkan kata kunci.
 */
function searchTasks() {
    loadTasks();
}

/**
 * Menerapkan filter pada daftar tugas.
 */
function filterTasks() {
    loadTasks();
}

function clearInputs() {
    document.getElementById('editNumber').value = ''; // Mengosongkan input nomor tugas
    document.getElementById('due-date').value = ''; // Mengosongkan input kalender
}

/**
 * Memuat daftar tugas saat DOM dimuat.
 */
document.addEventListener('DOMContentLoaded', function () {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadTasks();
});
