<script setup lang="ts">
import browser from "webextension-polyfill";
import { onMounted } from 'vue';
import { Message, MessageCommand } from './interfaces.mjs';

function onSaveOpenedTabsClick() {
    let msg: Message = { command: MessageCommand.SaveOpenedTabs };
    browser.runtime.sendMessage(msg)
}

function onOpenSavedTabsClick() {
    let msg: Message = { command: MessageCommand.OpenSavedTabs };
    browser.runtime.sendMessage(msg)
}

function onMountedHook() {
}

onMounted(onMountedHook);

</script>

<template>
    <div class="w-full h-full table p-2 space-y-2">
        <div class="flex justify-center">
            <button class="btn btn-sm btn-secondary" @click="onSaveOpenedTabsClick">Save Opened Tabs</button>
        </div>
        <div class="flex justify-center">
            <button class="btn btn-sm btn-secondary" @click="onOpenSavedTabsClick">Open Saved Tabs</button>
        </div>
    </div>
</template>

<script lang="ts">
</script>
