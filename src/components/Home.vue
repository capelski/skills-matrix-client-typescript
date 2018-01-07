<template>
    <div>
        <div class="row">
            <div class="col-xs-12">
                <div class="page-header">
                    <h2>Skills matrix</h2>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12">
                <p>
                    Suspendisse et metus ligula. Nulla laoreet imperdiet magna, quis egestas sem rhoncus vitae. In non maximus sem, eget accumsan risus. Nam porttitor lorem at purus mollis dictum. Vestibulum eleifend lorem non est consectetur, vel dignissim eros cursus. Aenean magna tortor, fringilla vitae vulputate sit amet, ornare et eros. Vestibulum eget suscipit elit
                </p>
                <img src="static/images/skills.png" class="responsive-img" />
            </div>
        </div>

        <div class="row">
            <div class="col-sm-6">
                <div class="row align-bottom">
                    <div class="col-xs-9">
                        <h2>Most skilled employees</h2>  
                    </div>
                    <div class="col-xs-3 m-bottom-10 text-right">
                        <button type="button" v-on:click="$router.push('/employees')" class="btn btn-default">
                            View all
                        </button>
                    </div>
                </div>
                <paginated-list
                    :itemsFetcher="employeesFetcher"
                    :itemDrawer="employeeDrawer"
                    :itemOnClick="(employee) => $router.push(`/employee/${employee.Id}`)">
                </paginated-list>
            </div>
            <div class="col-sm-6">
                <div class="row align-bottom">
                    <div class="col-xs-9">
                        <h2>Rearest skills</h2>
                    </div>
                    <div class="col-xs-3 m-bottom-10 text-right">
                        <button type="button" v-on:click="$router.push('/skills')" class="btn btn-default">
                            View all
                        </button>
                    </div>
                </div>
                <paginated-list
                    :itemsFetcher="skillsFetcher"
                    :itemDrawer="skillDrawer"
                    :itemOnClick="(skill) => $router.push(`/skill/${skill.Id}`)">
                </paginated-list>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Utils from '../utils';
    import { getInstance } from '../service-locator';
    import PaginatedList from './PaginatedList.vue';
    import EmployeeService from '../services/employee-service';
    import SkillService from '../services/skill-service';
    import PaginatedData from '../models/PaginatedData';
    import Employee from '../models/Employee';
    import Skill from '../models/Skill';

    const employeeService = getInstance<EmployeeService>('EmployeeService');
    const skillService = getInstance<SkillService>('SkillService');

    export default {
        components: {
            PaginatedList
        },
        data () {
            return {
                employeesFetcher: (keywords: string, page: number, pageSize: number) => {
                    return Utils.stallPromise(<Promise<Employee[]>> employeeService.getMostSkilled(), 1000)
                    .then((employees: Array<Employee>) => new PaginatedData(employees));
                },
                employeeDrawer (employee: Employee) {
                    return `${ employee.Name }
                        <span class="badge floating">${ employee.Skills.length }</span>`;
                },
                skillsFetcher: (keywords: string, page: number, pageSize: number) => {
                    return Utils.stallPromise(<Promise<Skill[]>> skillService.getRearest(), 1000)
                    .then((skills: Array<Skill>) => new PaginatedData(skills));
                },
                skillDrawer (skill: Skill) {
                    return `${ skill.Name }
                        <span class="badge floating">${ skill.Employees.length }</span>`;
                }
            };
        }
    };
</script>
