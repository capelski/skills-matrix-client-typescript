import HttpBaseService from './http-base-service';

export default class SkillService extends HttpBaseService {

    getRearest() : Promise<any> {
        return this.getRequest('api/skill/getRearest', null, []);
    }
    
    getAll(keywords: string, page: number, pageSize: number) : Promise<any> {
        return this.getRequest('api/skill', { keywords, page, pageSize }, []);
    }
    
    getById(id: number) : Promise<any> {
        return this.getRequest('api/skill/getById', { id }, null);
    }
    
    remove(skillId: number) : Promise<any> {
        return this.removeEntity(`api/skill?id=${skillId}`);
    }
    
    save(skill: any) : Promise<any> {
        return this.saveEntity('api/skill', skill);
    }
};
