<template>
  <div class="wrap">
    <!-- Loading splash until alias arrives -->
    <div v-if="loading" class="splash">Connecting…</div>

    <!-- Chat area -->
    <div v-else class="msg-list" ref="list">
      <div v-for="m in messages" :key="m.ts + m.user"
           :class="['msg', m.user === me ? 'mine' : '']">
        <span v-if="m.user !== me" class="badge">{{ m.user }}</span>
        {{ m.text }}
      </div>
    </div>

    <!-- Input bar -->
    <form class="input-bar" @submit.prevent="send">
      <input v-model="draft" placeholder="Type a message…" autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Item { type: 'CHAT'; user: string; text: string; ts: number }

const messages = ref<Item[]>([]);
const draft     = ref('');
const list      = ref<HTMLElement | null>(null);
const loading   = ref(true);
let   me        = '';
let   ws: WebSocket;

function scroll() {
  nextTick(() => list.value?.scrollTo({ top: list.value.scrollHeight }));
}

function send() {
  if (!draft.value.trim()) return;
  ws?.send(draft.value);
  draft.value = '';
}

onMounted(() => {
  const WS_URL = import.meta.env.VITE_WS_URL || `ws://${location.hostname}:3000`;
  ws = new WebSocket(WS_URL);

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.type === 'SYSTEM') {
      me = data.text.match(/\*\*(.+)\*\*/)?.[1] || '';
      loading.value = false;          // hide splash
      return;
    }
    messages.value.push(data);
    scroll();
  };
});
</script>

<style>
/* layout */
html, body, #app, .wrap { height: 100%; margin: 0; font-family: system-ui, sans-serif; }
.wrap        { display: flex; flex-direction: column; background: #f5f7fa; }

/* splash */
.splash      { margin: auto; font-size: 1.1rem; color: #666; }

/* message list */
.msg-list    { flex: 1; overflow-y: auto; padding: 1rem; }
.msg         { padding: .6rem 1rem; margin-bottom: .6rem; border-radius: 10px;
  background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.msg.mine    { background: #d9ecff; margin-left: auto; }
.badge       { font-size: .75rem; margin-right: .5rem; opacity: .7; }

/* input bar */
.input-bar   { display: flex; gap: .5rem; padding: .8rem; border-top: 1px solid #e0e3e8;
  background: #fff; }
.input-bar input { flex: 1; padding: .8rem 1rem; border: 1px solid #ccd2da;
  border-radius: 12px; font-size: .95rem; }
.input-bar button{ padding: .8rem 1.4rem; border: none; border-radius: 12px;
  background: #0d99ff; color: #fff; font-weight: 600;
  cursor: pointer; transition: background .2s; }
.input-bar button:hover{ background: #0b83dd; }
</style>
