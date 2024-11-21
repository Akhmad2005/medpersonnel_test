<script setup lang="ts">
import { useNursesStore } from "@/stores/nurses";
import { useDepartmentsStore } from "@/stores/departments";
import type { DepartmentId } from "@/utilities/types/index";
import { h, ref } from "vue";
import {
  DeleteFilled,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import NurseModal from "@/components/modal/nurse.vue";

const { list, deleteById } = useNursesStore();
const { findOne } = useDepartmentsStore();

const nurseModalOpen = ref<boolean>(false);
const nurseModalId = ref<number | null>(null);

const columns = [
  {
    title: "№",
    width: "1%",
    customRender: ({ index }: { index: number }) => {
      return index + 1;
    },
  },
  {
    title: "Ф.И.О.",
    dataIndex: "fullName",
  },
  {
    title: "Отделение",
    dataIndex: "departmentId",
    key: "departmentId",
    customRender: ({ text }: { text: DepartmentId }) => {
      let department = findOne({ id: text });
      return department?.name;
    },
  },
  {
    title: "",
    key: "actions",
    fixed: "right",
    width: "1%",
  },
];

const handleCloseModal = () => {
  nurseModalOpen.value = false;
  nurseModalId.value = null;
};

const handleDeleteNurse = (id: number) => {
  deleteById(id);
};
</script>

<template>
  <div class="page_nurses">
    <header class="page_nurses-header">
      <a-row>
        <a-col :flex="1"></a-col>
        <a-col>
          <a-button
            @click="
              () => {
                nurseModalId = null;
                nurseModalOpen = true;
              }
            "
            type="primary"
            :icon="h(PlusOutlined)"
            >Создать</a-button
          >
        </a-col>
      </a-row>
    </header>
    <main class="page_nurses-body">
      <a-table :pagination="false" :dataSource="list" :columns="columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button
                @click="
                  () => {
                    if (record?.id) {
                      nurseModalOpen = true;
                      nurseModalId = record.id;
                    }
                  }
                "
                type="link"
                :icon="h(EditOutlined)"
              ></a-button>
              <a-popconfirm
                title="Подтвердите свое действие!"
                @confirm="handleDeleteNurse(record.id)"
                placement="left"
              >
                <a-button danger type="link" :icon="h(DeleteFilled)"></a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </main>
    <NurseModal
      @cancel="handleCloseModal"
      @custom-cancel="handleCloseModal"
      :id="nurseModalId"
      :open="nurseModalOpen"
      v-if="nurseModalOpen"
    ></NurseModal>
  </div>
</template>
