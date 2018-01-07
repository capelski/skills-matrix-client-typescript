import HttpBaseService from './http-base-service';
import Skill from '../models/Skill';

export default class SkillService extends HttpBaseService {

    getRearest() : Promise<Array<Skill>> {
        return this.getRequest<Skill[]>('api/skill/getRearest', null, []);
    }
    
    getAll(keywords: string, page: number, pageSize: number) : Promise<Array<Skill>> {
        return this.getRequest<Skill[]>('api/skill', { keywords, page, pageSize }, []);
    }
    
    getById(id: number) : Promise<Skill> {
        return this.getRequest<Skill>('api/skill/getById', { id }, null);
    }
    
    remove(skillId: number) : Promise<Skill> {
        return this.removeEntity<Skill>(`api/skill?id=${skillId}`);
    }
    
    save(skill: any) : Promise<Skill> {
        return this.saveEntity<Skill>('api/skill', skill);
    }
};
