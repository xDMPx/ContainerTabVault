<script setup lang="ts">
import browser from "webextension-polyfill";
import { ref, onMounted } from 'vue';
import { Message, MessageCommand } from './interfaces.mjs';
import { getState, setState } from "./utils.mjs";

const closeTabs = ref(false);

function onSaveOpenedTabsClick() {
    let msg: Message = { command: MessageCommand.SaveOpenedTabs };
    browser.runtime.sendMessage(msg);
}

function onOpenSavedTabsClick() {
    let msg: Message = { command: MessageCommand.OpenSavedTabs };
    browser.runtime.sendMessage(msg);
}

async function toggleCloseTabs() {
    const state = await getState();
    state.closeTabs = !state.closeTabs;
    console.log(`ContainerTabVaultPopup; toggleCloseTabs => ${state.closeTabs}`);
    await setState(state);
}

async function getCloseTabsValue(): Promise<boolean> {
    const state = await getState();
    return state.closeTabs;
}

function onMountedHook() {
    getCloseTabsValue().then((value) => closeTabs.value = value);
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
        <div class="divider" />
        <div class="form-control">
            <label class="label cursor-pointer mr-auto">
                <span class="label-text pr-2">Close current tabs when restoring workspace:</span>
                <input class="checkbox" @click="toggleCloseTabs" v-model="closeTabs" name="closeTabs" type="checkbox"
                    checked="true" />
            </label>
        </div>
    </div>
</template>

<script lang="ts">
</script>
