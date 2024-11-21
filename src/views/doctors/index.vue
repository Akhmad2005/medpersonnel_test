<script setup lang="ts">
import { ref } from "vue";
import { useDoctorsStore } from "@/stores/doctors";
import { useDepartmentsStore } from "@/stores/departments";
import type { DepartmentId } from "@/utilities/types/index";
import { h } from "vue";
import {
  DeleteFilled,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import DoctorModal from "@/components/modal/doctor.vue";

const { list, deleteById } = useDoctorsStore();
const { findOne } = useDepartmentsStore();

const doctorModalOpen = ref<boolean>(false);
const doctorModalId = ref<number | null>(null);

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
    title: "Заведующий",
    dataIndex: "manager",
    key: "manager",
  },
  {
    title: "",
    key: "actions",
    fixed: "right",
    width: "1%",
  },
];

const handleDeleteDoctor = (id: number) => {
  deleteById(id);
};

const handleCloseModal = () => {
  doctorModalOpen.value = false;
  doctorModalId.value = null;
};
</script>

<template>
  <div class="page_doctors">
    <header class="page_doctors-header">
      <a-row>
        <a-col :flex="1"></a-col>
        <a-col>
          <a-button
            @click="
              () => {
                doctorModalId = null;
                doctorModalOpen = true;
              }
            "
            type="primary"
            :icon="h(PlusOutlined)"
            >Создать</a-button
          >
        </a-col>
      </a-row>
    </header>
    <main class="page_doctors-body">
      <a-table
        :pagination="false"
        bordered
        :dataSource="list"
        :columns="columns"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.key === 'manager'">
            <a-tag color="blue" v-if="text"> Заведующий </a-tag>
          </template>
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button
                @click="
                  () => {
                    if (record?.id) {
                      doctorModalOpen = true;
                      doctorModalId = record.id;
                    }
                  }
                "
                type="link"
                :icon="h(EditOutlined)"
              ></a-button>
              <a-popconfirm
                title="Подтвердите свое действие!"
                @confirm="handleDeleteDoctor(record.id)"
                placement="left"
              >
                <a-button danger type="link" :icon="h(DeleteFilled)"></a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </main>
    <DoctorModal
      @cancel="handleCloseModal"
      @custom-cancel="handleCloseModal"
      :id="doctorModalId"
      :open="doctorModalOpen"
      v-if="doctorModalOpen"
    ></DoctorModal>
  </div>
</template>
