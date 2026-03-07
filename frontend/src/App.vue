<template>
  <div class="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
    
    <div class="max-w-6xl mx-auto flex justify-between items-center mb-12">
      <div class="flex items-center gap-3">
        <div class="bg-purple-600 p-2 rounded-lg shadow-lg shadow-purple-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">KanbanFlow</h1>
          <p class="text-xs text-slate-400">Engineering Task Board</p>
        </div>
      </div>

      <button @click="showForm = !showForm" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30">
        <span>{{ showForm ? '✕ Close' : '+ New Task' }}</span>
      </button>
    </div>

    <div v-if="showForm" class="max-w-md mx-auto mb-10 bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-2xl">
      <div class="flex flex-col gap-4">
        <input v-model="newTask.title" placeholder="What needs to be done?" class="bg-[#0f172a] border-none rounded-lg p-3 focus:ring-2 ring-indigo-500 outline-none text-sm" />
        <textarea v-model="newTask.description" placeholder="Add some details..." class="bg-[#0f172a] border-none rounded-lg p-3 focus:ring-2 ring-indigo-500 outline-none text-sm h-24"></textarea>
        <button @click="addTask(); showForm = false" class="bg-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-500 transition-colors">Create Task</button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="(col, index) in columns" :key="col" class="flex flex-col">
        
        <div class="flex items-center gap-2 mb-6 px-2">
          <div :class="['w-3 h-3 rounded-full', index === 0 ? 'bg-blue-400' : index === 1 ? 'bg-yellow-400' : 'bg-green-400']"></div>
          <h2 class="text-sm font-bold uppercase tracking-widest text-slate-300">{{ col }}</h2>
          <span class="ml-auto text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-400 font-mono">{{ getTaskCount(col) }}</span>
        </div>

        <draggable :list="tasks" group="tasks" item-key="_id" @change="(e) => onMove(e, col)" class="min-h-[500px] bg-slate-800/20 rounded-3xl p-4 border-2 border-dashed border-slate-800/50">
          <template #item="{ element }">
            <div v-if="element.status === col" class="bg-[#1e293b] border border-slate-700 p-5 rounded-2xl mb-4 shadow-lg hover:border-indigo-500/50 transition-all group relative cursor-grab active:cursor-grabbing">
              
              <div class="flex flex-col gap-2">
                <h3 class="font-bold text-slate-100 break-all pr-6">{{ element.title }}</h3>
                <p class="text-xs text-slate-400 leading-relaxed break-all whitespace-pre-wrap">{{ element.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                   <span class="text-[10px] font-mono text-slate-500 uppercase">ID: {{ element._id.slice(-5) }}</span>
                   <button @click.stop="deleteTask(element._id)" class="text-slate-600 hover:text-red-400 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>
              </div>
            </div>
            <div v-else class="hidden"></div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import axios from 'axios';

// Logic variables
const tasks = ref([]);
const columns = ['To Do', 'In Progress', 'Done'];
const newTask = ref({ title: '', description: '' });
const showForm = ref(false); // Controls the pop-up form visibility

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const fetchData = async () => {
  const { data } = await api.get('/tasks');
  tasks.value = data;
};

const addTask = async () => {
  if (!newTask.value.title.trim()) return;
  const { data } = await api.post('/tasks', { ...newTask.value, status: 'To Do' });
  tasks.value.push(data);
  newTask.value = { title: '', description: '' };
};

const deleteTask = async (id) => {
  if (!confirm("Delete this task?")) return;
  await api.delete(`/tasks/${id}`);
  tasks.value = tasks.value.filter(t => t._id !== id);
};

const getTaskCount = (status) => tasks.value.filter(t => t.status === status).length;

const onMove = async (evt, newStatus) => {
  if (evt.added) {
    const task = evt.added.element;
    await api.patch(`/tasks/${task._id}`, { status: newStatus });
    const target = tasks.value.find(t => t._id === task._id);
    if (target) target.status = newStatus;
  }
};

onMounted(fetchData);
</script>