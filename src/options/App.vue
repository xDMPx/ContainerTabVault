<script setup lang="ts">
import { getState, setState, getTabs } from "../utils.mjs";
import { Tab } from "../interfaces.mjs";

async function onExportClick() {
    const exportData = await getTabs();
    const blob = new Blob([exportData.join('\n\n')], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ContainerTabVault-export.txt';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function onImportClick(event: Event) {
    const target = event.target as HTMLInputElement;

    const reader = new FileReader();
    reader.readAsText(target.files![0]);
    reader.onload = (async (e: ProgressEvent<FileReader>) => {
        const workspaces = [];
        const result = e.target?.result as string;
        let workspaceName = undefined;
        let tabs: Tab[] = [];
        for (const line of result.split('\n').map((l) => l.trim())) {
            if (line.length === 0) {
                workspaces.push({ workspaceName: workspaceName, tabs: tabs });
                workspaceName = undefined;
                tabs = [];
            }
            else if (workspaceName == undefined) {
                workspaceName = line.split(';')[1].slice(0, line.length - 2);
                workspaceName = workspaceName.slice(0, workspaceName.length - 1);
            } else {
                const i = line.lastIndexOf(';');
                const url = line.slice(0, i);
                const cookieStoreId = line.slice(i + 1);

                tabs.push({
                    url: (url !== "undefined") ? url : undefined,
                    cookieStoreId: cookieStoreId
                });
            }
        }
        if (workspaceName !== undefined) {
            workspaces.push({ workspaceName: workspaceName, tabs: tabs });
            workspaceName = undefined;
        }

        for (const workspace of workspaces) {
            const state = await getState();
            const last_index = [...state.tabs.keys()].map((k) => +k.slice(0, k.indexOf(';')))
                .filter((x: number) => !Number.isNaN(x))
                .sort().pop() || 0;

            state.tabs.set(`${last_index + 1};${workspace.workspaceName}`, workspace.tabs);
            setState(state);
        }

    });

}
</script>

<template>
    <div class="w-full h-full table p-2 space-y-2">
        <div class="flex justify-center">
            <button class="btn btn-sm btn-secondary" @click="onExportClick">Export</button>
        </div>
    </div>
    <div class="flex justify-center">
        <div class="grid gap-2 grid-cols-1">
            <span class="label-text">Import: </span>
            <input type="file" class="file-input file-input-bordered file-input-sm w-min" @change="onImportClick">
        </div>
    </div>
</template>

<script lang="ts">
</script>
