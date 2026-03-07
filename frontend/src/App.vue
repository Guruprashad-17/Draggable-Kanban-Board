<template>
  <div :class="['min-h-screen p-8 font-sans transition-all duration-500', isDark ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-slate-900']">
    
    <div class="max-w-6xl mx-auto flex justify-between items-center mb-12">
      <div class="flex items-center gap-3">
        <div class="bg-indigo-600 p-2 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold tracking-tight">KanbanFlow</h1>
      </div>

      <div class="flex items-center gap-4">
        <button @click="isDark = !isDark" class="p-2 rounded-full border border-slate-700 hover:bg-slate-500/10 transition-colors">
          <span v-if="isDark" title="Switch to Light Mode">☀️</span>
          <span v-else title="Switch to Dark Mode">🌙</span>
        </button>

        <button @click="showForm = !showForm" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full font-semibold text-white shadow-lg">
          {{ showForm ? '✕ Close' : '+ New Task' }}
        </button>
      </div>
    </div>

    <div v-if="showForm" :class="['max-w-md mx-auto mb-10 p-6 rounded-2xl border shadow-2xl transition-colors', isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-200']">
      <div class="flex flex-col gap-4">
        <input v-model="newTask.title" placeholder="Title" :class="['p-3 rounded-lg outline-none ring-indigo-500 focus:ring-2', isDark ? 'bg-[#0f172a]' : 'bg-gray-100']" />
        <textarea v-model="newTask.description" placeholder="Description" :class="['p-3 rounded-lg outline-none ring-indigo-500 focus:ring-2 h-24', isDark ? 'bg-[#0f172a]' : 'bg-gray-100']"></textarea>
        <button @click="addTask(); showForm = false" class="bg-indigo-600 py-2 rounded-lg font-bold text-white hover:bg-indigo-500">Create Task</button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="col in columns" :key="col" class="flex flex-col">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-4 opacity-70 px-2">{{ col }} ({{ getTaskCount(col) }})</h2>
        
        <draggable :list="tasks" group="tasks" item-key="_id" @change="(e) => onMove(e, col)" :class="['min-h-[500px] rounded-3xl p-4 border-2 border-dashed transition-colors', isDark ? 'bg-slate-800/20 border-slate-800/50' : 'bg-gray-200/50 border-gray-300']">
          <template #item="{ element }">
            <div v-if="element.status === col" :class="['p-5 rounded-2xl mb-4 shadow-lg border transition-all', isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-200']">
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold break-all">{{ element.title }}</h3>
                  <p class="text-xs opacity-70 mt-1 break-all whitespace-pre-wrap">{{ element.description }}</p>
                </div>
                <button @click.stop="deleteTask(element._id)" class="text-red-500 ml-2">✕</button>
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

const isDark = ref(true); // Toggle state
const showForm = ref(false);
const tasks = ref([]);
const columns = ['To Do', 'In Progress', 'Done'];
const newTask = ref({ title: '', description: '' });
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