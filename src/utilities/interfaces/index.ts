import type { DepartmentId } from "../types";

export interface Worker {
	fullName: string;
	departmentId: DepartmentId | null;
	id: number
}
export interface Nurse extends Worker {

}
export interface Doctor extends Worker {
	manager: boolean;
}
export interface Department {
  name: string;
  id: DepartmentId;
}