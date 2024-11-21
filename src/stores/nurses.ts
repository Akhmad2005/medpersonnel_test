import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
import { defineStore } from 'pinia'
import type { Nurse } from '@/utilities/interfaces'
import { message } from 'ant-design-vue'


export const useNursesStore = defineStore('nurses', () => {
  const baseList = ref<Nurse[]>([
    { fullName: 'Анна Иванова', departmentId: 1, id: 1 },
    { fullName: 'Максим Новиков', departmentId: 2, id: 2 },
    { fullName: 'Дмитрий Кузнецов', departmentId: 1, id: 3 },
    { fullName: 'Ольга Лебедева', departmentId: 2, id: 4 },
    { fullName: 'Елена Попова', departmentId: 1, id: 5 },
    { fullName: 'Иван Петров', departmentId: 2, id: 6},
    { fullName: 'Алексей Соколов', departmentId: 1, id: 7 },
    { fullName: 'Светлана Орлова', departmentId: 2, id: 8 },
    { fullName: 'Мария Смирнова', departmentId: 1, id: 9 },
    { fullName: 'Екатерина Воробьёва', departmentId: 2, id: 10 },
  ])

  const list = computed(() => {
    return baseList
  })

  const latestIdInList = computed<number>(() => {
    const latestId = Math.max(...baseList.value.map((item) => item.id)) || 1;
    return latestId
  })

  function create (nurse: Omit<Nurse, 'id'>) {
    try {
      baseList.value.push({...nurse, id: latestIdInList.value})
      message.success('Медсестра успешно создана!')
    } catch (error) {
      console.error('ErrorCreatingNurse', error);
      message.error('Ошибка при создании медсестры') 
    }
  }

  function updateById (id: Nurse['id'], nurse: Omit<Nurse, 'id'>) {
     try {
       let index = baseList.value.findIndex((i => i.id == id))
       baseList.value.splice(index, 1, {...nurse, id})
       message.success('Медсестра успешно редактирована!')
     } catch (error) {
      console.error('ErrorEditingNurse', error);
      message.error('Ошибка при редактировании медсестры')
     }
  }

  function deleteById(id: number) {
    try {
      baseList.value = baseList.value.filter(i => i.id != id)
      message.success('Медсестра успешно удалёна!')
    } catch (error) {
      console.error('ErrorDeletingNurse', error);
      message.error('Ошибка при удалении медсестры')
    }
  }

  function findOne<K extends keyof Nurse>(criteria: { [P in K]: Nurse[K] }): Nurse | undefined {
    const key = Object.keys(criteria)[0] as K;
    const value = criteria[key];
    const nurse = baseList.value.find((nurse) => nurse[key] === value);

    return {...nurse};
  }

  onMounted(() => {
    let nursesFromLocalStorage = localStorage.getItem('nurses')
    if (nursesFromLocalStorage?.length) {
      baseList.value = JSON.parse(nursesFromLocalStorage);
    }
  })

  onBeforeUpdate(() => {
    localStorage.setItem('nurses', JSON.stringify(baseList.value))
  })

  return { list, create, deleteById, updateById, findOne }
})
