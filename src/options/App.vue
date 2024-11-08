<script setup lang="ts">
import { getTabs } from "../utils.mjs";

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
</script>

<template>
    <div class="w-full h-full table p-2 space-y-2">
        <div class="flex justify-center">
            <button class="btn btn-sm btn-secondary" @click="onExportClick">Export</button>
        </div>
    </div>
</template>

<script lang="ts">
</script>
