import Skill from './Skill';

export default class Employee {
    
    Id: number;
    Name: string;
    Skills: Array<Skill>

    constructor() {
        this.Id = 0;
        this.Name = '';
        this.Skills = [];
    }
};