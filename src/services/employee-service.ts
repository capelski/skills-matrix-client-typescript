import HttpBaseService from './http-base-service';

export default class EmployeeService extends HttpBaseService {

    getAll(keywords: string, page: number, pageSize: number) : Promise<any> {
        return this.getRequest('api/employee', { keywords, page, pageSize }, []);
    }
    
    getById(id: number) : Promise<any> {
        return this.getRequest('api/employee/getById', { id }, null);
    }

    getMostSkilled() : Promise<any> {
        return this.getRequest('api/employee/getMostSkilled', null, []);
    }
    
    remove(employeeId: number) : Promise<any> {
        return this.removeEntity(`api/employee?id=${employeeId}`);
    }

    save(employee: any) : Promise<any> {
        return this.saveEntity('api/employee', employee);
    }
};
