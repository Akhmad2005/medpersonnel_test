import { ref, computed, onMounted, onBeforeUnmount, onBeforeUpdate } from 'vue'
import { defineStore } from 'pinia'
import type { Doctor } from '@/utilities/interfaces'
import { message } from 'ant-design-vue'


export const useDoctorsStore = defineStore('doctors', () => {
  const baseList = ref<Doctor[]>([
    { fullName: 'Иван Иванов', departmentId: 1, manager: true, id: 1 },
    { fullName: 'Виктор Орлов', departmentId: 2, manager: false, id: 2 },
    { fullName: 'Дмитрий Смирнов', departmentId: 1, manager: false, id: 3 },
    { fullName: 'Светлана Лебедева', departmentId: 2, manager: false, id: 4 },
    { fullName: 'Елена Кузнецова', departmentId: 1, manager: false, id: 5 },
    { fullName: 'Александр Попов', departmentId: 2, manager: true, id: 6 },
    { fullName: 'Ольга Соколова', departmentId: 1, manager: false, id: 7 },
    { fullName: 'Наталья Новикова', departmentId: 2, manager: false, id: 8 },
    { fullName: 'Мария Петрова', departmentId: 1, manager: false, id: 9 },
    { fullName: 'Максим Воробьёв', departmentId: 2, manager: false, id: 10 },
  ])

  const list = computed(() => {
    return baseList
  })

  const latestIdInList = computed<number>(() => {
    const latestId = Math.max(...baseList.value.map((item) => item.id)) || 1;
    return latestId
  })

  function create (doctor: Omit<Doctor, 'id'>) {
    try {
      baseList.value.push({...doctor, id: latestIdInList.value})
      message.success('Врач успешно создан!')
    } catch (error) {
      console.error('ErrorCreatingDoctor', error);
      message.error('Ошибка при создании врача') 
    }
  }

  function updateById (id: Doctor['id'], doctor: Omit<Doctor, 'id'>) {
     try {
       let index = baseList.value.findIndex((i => i.id == id))
       baseList.value.splice(index, 1, {...doctor, id})
       message.success('Врач успешно редактирован!')
     } catch (error) {
      console.error('ErrorEditingDoctor', error);
      message.error('Ошибка при редактировании врача')
     }
  }

  function deleteById(id: number) {
    try {
      baseList.value = baseList.value.filter(i => i.id != id)
      message.success('Врач успешно удалён!')
    } catch (error) {
      console.error('ErrorDeletingDoctor', error);
      message.error('Ошибка при удалении врача')
    }
  }

  function findOne<K extends keyof Doctor>(criteria: { [P in K]: Doctor[K] }): Doctor | undefined {
    const key = Object.keys(criteria)[0] as K;
    const value = criteria[key];
    const doctor = baseList.value.find((doctor) => doctor[key] === value);

    return {...doctor};
  }

  onMounted(() => {
    let doctorsFromLocalStorage = localStorage.getItem('doctors')
    if (doctorsFromLocalStorage?.length) {
      baseList.value = JSON.parse(doctorsFromLocalStorage);
    }
  })

  onBeforeUpdate(() => {
    localStorage.setItem('doctors', JSON.stringify(baseList.value))
  })

  return { list, create, deleteById, updateById, findOne }
})
