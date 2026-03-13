<template>
  <div 
    :class="['min-h-screen p-8 transition-all duration-700', isDark ? 'text-white' : 'text-slate-900']"
    :style="{ 
      backgroundImage: isDark ? 'url(/dark-background.jpg)' : 'url(/my-background.jpg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <div class="max-w-6xl mx-auto flex justify-between items-center mb-12 glass-header p-6 rounded-2xl">
      <div class="flex items-center gap-3">
        <div class="bg-indigo-600 p-2 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold tracking-tight">KanbanFlow</h1>
      </div>

      <div class="flex items-center gap-4">
        <button @click="isDark = !isDark" class="p-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
          <span v-if="isDark">☀️ Sunny Day</span>
          <span v-else>🌙 Night Mode</span>
        </button>

        <button @click="showForm = !showForm" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-transform active:scale-95">
          {{ showForm ? '✕ Close' : '+ New Task' }}
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showForm" :class="['max-w-md mx-auto mb-10 p-6 rounded-2xl border shadow-2xl glass-card', isDark ? 'border-white/10' : 'border-gray-200/50']">
        <div class="flex flex-col gap-4">
          <input v-model="newTask.title" placeholder="Title" :class="['p-3 rounded-lg outline-none ring-indigo-500 focus:ring-2', isDark ? 'bg-slate-900/50 text-white' : 'bg-gray-100/50']" />
          <textarea v-model="newTask.description" placeholder="Description" :class="['p-3 rounded-lg outline-none ring-indigo-500 focus:ring-2 h-24', isDark ? 'bg-slate-900/50 text-white' : 'bg-gray-100/50']"></textarea>
          <button @click="addTask(); showForm = false" class="bg-indigo-600 py-2 rounded-lg font-bold text-white hover:bg-indigo-500 shadow-md">Create Task</button>
        </div>
      </div>
    </transition>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="col in columns" :key="col" class="flex flex-col">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-4 opacity-80 px-2 flex justify-between">
          <span>{{ col }}</span>
          <span class="bg-indigo-600/20 px-2 py-0.5 rounded-full text-[10px]">{{ getTaskCount(col) }}</span>
        </h2>
        
        <draggable 
          :list="tasks" 
          group="tasks" 
          item-key="_id" 
          @change="(e) => onMove(e, col)" 
          :class="['min-h-[500px] rounded-3xl p-4 border-2 border-dashed transition-all glass-column', isDark ? 'border-white/10' : 'border-white/40']"
        >
          <template #item="{ element }">
            <div v-if="element.status === col" class="p-5 rounded-2xl mb-4 shadow-xl border transition-all glass-task-card group">
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold break-all text-lg">{{ element.title }}</h3>
                  <p class="text-xs opacity-80 mt-1 break-all whitespace-pre-wrap line-clamp-3">{{ element.description }}</p>
                </div>
                <button @click.stop="deleteTask(element._id)" class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">✕</button>
              </div>
            </div>
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

const isDark = ref(false); 
const showForm = ref(false);
const tasks = ref([]);
const columns = ['To Do', 'In Progress', 'Done'];
const newTask = ref({ title: '', description: '' });
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const fetchData = async () => {
  try {
    const { data } = await api.get('/tasks');
    tasks.value = data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
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
    // Local update to keep UI in sync
    const target = tasks.value.find(t => t._id === task._id);
    if (target) target.status = newStatus;
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* 1. UNIVERSAL GLASSMORPHISM */
.glass-header, .glass-card, .glass-column, .glass-task-card {
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

/* 2. LIGHT MODE GLASS */
div:not(.text-white) .glass-task-card {
  background-color: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: #0f172a !important;
}
div:not(.text-white) .glass-task-card p {
  color: #334155 !important;
}

/* 3. DARK MODE GLASS */
.text-white .glass-task-card {
  background-color: rgba(15, 23, 42, 0.75) !important; 
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}
.text-white .glass-task-card p {
  color: #cbd5e1 !important;
}

/* 4. HEADERS */
.text-white h2 {
  color: #f8fafc !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* 5. HOVER & TRANSITIONS */
.glass-task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.transition-all {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>