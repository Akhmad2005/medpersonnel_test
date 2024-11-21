<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import type { Nurse } from "@/utilities/interfaces";
import { useDepartmentsStore } from "@/stores/departments";
import { useNursesStore } from "@/stores/nurses";
import { Form } from "ant-design-vue";

const useForm = Form.useForm;

const loading = ref<boolean>(false);

interface Form extends Omit<Omit<Nurse, "id">, "departmentId"> {
  departmentId: Nurse["departmentId"] | null;
  id: Nurse["id"] | null;
}

const $emit = defineEmits(["custom-cancel"]);

const props = defineProps({
  id: {
    type: [Number, null],
    required: true,
  },
});

const { list } = useDepartmentsStore();
const { findOne, create, updateById } = useNursesStore();

const form = ref<Form>({
  fullName: "",
  departmentId: null,
  id: null,
});

const rules = reactive({
  fullName: [
    {
      required: true,
      message: "Поле обязательно для заполнения",
    },
  ],
  departmentId: [
    {
      required: true,
      message: "Поле обязательно для заполнения",
    },
  ],
});

const {
  resetFields,
  validate,
  validateInfos,
  mergeValidateInfo,
  clearValidate,
} = useForm(form, rules);

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      let nurse = findOne({ id: newId });
      nurse && (form.value = nurse);
    } else {
      form.value = {
        fullName: "",
        departmentId: null,
        id: null,
      };
    }
  },
  { immediate: true }
);

const createNurse = () => {
  create(form.value);
};

const updateNurse = (id: number) => {
  updateById(id, form.value);
};

const handleSubmit = () => {
  loading.value = true;
  validate()
    .then(() => {
      if (props.id) {
        updateNurse(props.id);
      } else {
        createNurse();
      }
      $emit("custom-cancel");
    })
    .catch((err) => {
      console.log("error", err);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <a-modal
    cancelText="Отменить"
    :title="
      id ? 'Редактировать информацию о медсестре' : 'Создать новую медсестру'
    "
    :open="true"
    :okText="id ? 'Сохранить' : 'Создать'"
    @ok="handleSubmit"
    :confirm-loading="loading"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item v-bind="validateInfos.fullName" label="Полное имя">
        <a-input
          @blur="validate('fullName', { trigger: 'blur' }).catch(() => {})"
          v-model:value="form.fullName"
          placeholder="Полное имя"
        ></a-input>
      </a-form-item>
      <a-form-item v-bind="validateInfos.departmentId" label="Отделение">
        <a-select
          @blur="validate('departmentId', { trigger: 'blur' }).catch(() => {})"
          v-model:value="form.departmentId"
          placeholder="Отделение"
          :options="
            list.map((l) => ({
              value: l.id,
              label: l.name,
            }))
          "
        ></a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
