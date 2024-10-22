<script setup lang="ts">
import browser from "webextension-polyfill";
import { onMounted } from 'vue';
import { Message, MessageCommand } from './interfaces.mjs';

function onDuplicateTabClick() {
    let msg: Message = { command: MessageCommand.DuplicateTab };
    browser.runtime.sendMessage(msg)
}

function onMountedHook() {
}

onMounted(onMountedHook);

</script>

<template>
    <div class="w-full h-full table p-2">
        <div class="flex justify-center">
            <button class="btn btn-sm btn-secondary" @click="onDuplicateTabClick">Duplicate active tab</button>
        </div>
    </div>
</template>

<script lang="ts">
</script>
