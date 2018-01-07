import Employee from './Employee';

export default class Skill {
    
    Id: number;
    Name: string;
    Employees: Array<Employee>

    constructor() {
        this.Id = 0;
        this.Name = '';
        this.Employees = [];
    }
};