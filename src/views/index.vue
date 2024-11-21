<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  console.log("Hello");

  router.push("/doctors");
});
</script>
