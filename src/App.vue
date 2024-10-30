<script setup lang="ts">
import browser from "webextension-polyfill";
import { ref, onMounted, Ref, nextTick } from 'vue';
import { Message, MessageCommand } from './interfaces.mjs';
import { getState, setState } from "./utils.mjs";

const closeTabs = ref(false);
const savedNames: Ref<string[]> = ref([]);
const editWorkspace: Ref<string | null> = ref(null);
const newWorkspaceName: Ref<string> = ref("");
const workspaceNameInput: Ref<HTMLElement[] | null | undefined> = ref();

async function onSaveOpenedTabsClick() {
    let msg: Message = { command: MessageCommand.SaveOpenedTabs, savedWorkspaceName: undefined, newWorkspaceName: undefined };
    await browser.runtime.sendMessage(msg);
    onMountedHook();
}

function onWorkspaceNameClick(name: string) {
    let msg: Message = { command: MessageCommand.OpenSavedTabs, savedWorkspaceName: name, newWorkspaceName: undefined };
    browser.runtime.sendMessage(msg);
}

function onEditWorkspaceNameClick(name: string) {
    editWorkspace.value = name;
    newWorkspaceName.value = name;
    nextTick(() => {
        workspaceNameInput.value!.at(0)!.focus();
    });
}

async function onSaveWorkspaceNameClick(name: string, new_name: string) {
    if (name !== new_name) {
        let msg: Message = { command: MessageCommand.RenameWorkspace, savedWorkspaceName: name, newWorkspaceName: new_name };
        await browser.runtime.sendMessage(msg);
    }
    editWorkspace.value = null;
    newWorkspaceName.value = "";
    onMountedHook();
}

async function onDeleteWorkspaceClick(name: string) {
    let msg: Message = { command: MessageCommand.DeleteWorkspace, savedWorkspaceName: name, newWorkspaceName: undefined };
    await browser.runtime.sendMessage(msg);
    onMountedHook();
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


async function getSavedWorkspacesNames(): Promise<string[]> {
    const state = await getState();
    return [...state.tabs.keys()];
}

function onMountedHook() {
    getCloseTabsValue().then((value) => closeTabs.value = value);
    getSavedWorkspacesNames().then((values) => savedNames.value = values);
}

onMounted(onMountedHook);
</script>

<template>
    <div class="w-full h-full table p-2 space-y-2">
        <div v-for="name in savedNames">
            <div v-if="editWorkspace !== name">
                <button class="btn btn-link btn-xs" @click="onWorkspaceNameClick(name)">{{ name }}</button>
                <button class="btn btn-ghost btn-xs" @click="onDeleteWorkspaceClick(name)">X</button>
                <button class="btn btn-ghost btn-xs" @click="onEditWorkspaceNameClick(name)">E</button>
            </div>
            <div v-else>
                <input ref="workspaceNameInput" type="text" v-model="newWorkspaceName"
                    v-on:focusout="onSaveWorkspaceNameClick(name, newWorkspaceName)"
                    @keyup.enter="onSaveWorkspaceNameClick(name, newWorkspaceName)" class="input w-full max-w-xs" />
            </div>
        </div>
        <div class="divider" />
        <div class="flex justify-center">
            <button class="btn btn-sm btn-secondary" @click="onSaveOpenedTabsClick">Save Opened Tabs</button>
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
