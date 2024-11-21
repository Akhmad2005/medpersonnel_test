import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Department } from '@/utilities/interfaces'


export const useDepartmentsStore = defineStore('departments', () => {
  const list = ref<Department[]>([
    {
      name: 'кардиологическое',
      id: 1,
    },
    {
      name: 'хирургическое',
      id: 2,
    },
  ])

  function findOne<K extends keyof Department>(criteria: { [P in K]: Department[K] }): Department | undefined {
    const key = Object.keys(criteria)[0] as K;
    const value = criteria[key];
    const department = list.value.find((department) => department[key] === value)

    return department && {...department};
  }
  
 

  return { list, findOne }
})
