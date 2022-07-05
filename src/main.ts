import './index.css';
import { v4 } from 'uuid';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const taskForm = document.querySelector<HTMLFormElement>('#taskForm');
const taskList = document.querySelector<HTMLElement>('#tasksList');

interface Task {
  title: string;
  description: string;
  id: string,
}
let tasks: Task[] = [];

taskForm?.addEventListener('submit', e => {
  e.preventDefault();

  const title = taskForm['title'] as unknown as HTMLInputElement;
  const description = taskForm['description'] as unknown as HTMLTextAreaElement;

  tasks.unshift({ 
    id: v4(),
    title: title.value,
    description: description.value,
  });

  Toastify({
    text: `Task '${title.value}' was saved`,
  }).showToast();

  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  title.focus();
  renderTasks(tasks);
});

document.addEventListener('DOMContentLoaded', () => {
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  renderTasks(tasks);
});

function renderTasks(tasks: Task[]) {
  taskList!.innerHTML = '';

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'bg-zinc-800 mb-1 p-4 rounded-lg hover:bg-zinc-700 hover:cursor-pointer';
    
    const header = document.createElement('header');
    header.className = 'flex justify-between';
    
    const title = document.createElement('span');
    title.innerText = task.title;

    const description = document.createElement('p');
    description.innerText = task.description;

    const btnDelete = document.createElement('button');
    btnDelete.innerText = 'Delete';
    btnDelete.className = 'bg-red-500 px-2 py-1 rounded-md';
    
    header.append(title);
    header.append(btnDelete);

    btnDelete.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));

      Toastify({
        text: 'Task deleted',
        gravity: 'bottom',
        duration: 2000,
        style: {
          background: 'red',
          // background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();

      renderTasks(tasks);
    });

    const id = document.createElement('p');
    id.innerText = task.id;
    id.className = 'text-gray-600 text-xs;'


    taskElement.append(header);
    taskElement.append(description);
    taskElement.append(id);
    taskList?.append(taskElement);
  });
}