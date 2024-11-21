<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const selectedKeys = ref<string[]>([]);

const hanldeMenuSelect = ({ key }: { key: string }) => {
  router.push("/" + key);
};

watch(
  () => route.name,
  (newName) => {
    if (newName) {
      selectedKeys.value = [String(newName)];
    }
  }
);
</script>

<template>
  <a-layout>
    <a-affix :offset-top="0">
      <a-layout-header>
        <header>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            @select="hanldeMenuSelect"
            theme="dark"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="doctors">Врачи</a-menu-item>
            <a-menu-item key="nurses">Медсестры</a-menu-item>
          </a-menu>
        </header>
      </a-layout-header>
    </a-affix>
    <a-layout-content>
      <RouterView />
    </a-layout-content>
  </a-layout>
</template>
