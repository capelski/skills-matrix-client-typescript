import HttpBaseService from './http-base-service';
import Employee from '../models/Employee';

export default class EmployeeService extends HttpBaseService {

    getAll(keywords: string, page: number, pageSize: number) : Promise<Array<Employee>> {
        return this.getRequest<Employee[]>('api/employee', { keywords, page, pageSize }, []);
    }
    
    getById(id: number) : Promise<Employee> {
        return this.getRequest<Employee>('api/employee/getById', { id }, null);
    }

    getMostSkilled() : Promise<Array<Employee>> {
        return this.getRequest<Employee[]>('api/employee/getMostSkilled', null, []);
    }
    
    remove(employeeId: number) : Promise<Employee> {
        return this.removeEntity<Employee>(`api/employee?id=${employeeId}`);
    }

    save(employee: any) : Promise<Employee> {
        return this.saveEntity<Employee>('api/employee', employee);
    }
};
