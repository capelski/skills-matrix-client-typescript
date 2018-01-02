<template>
    <div class="loader-wrapper">
        <div class="loader-animation">
            <div class="sk-chasing-dots">
                <div class="sk-child sk-dot1"></div>
                <div class="sk-child sk-dot2"></div>
            </div>
        </div>

        <div :class="{ 'loaded-content': true, 'loading': loading}">
            <div v-if="notFound">
                <h2>The selected skill does not exist</h2>
            </div>

            <div v-if="notFound == false">
                <div class="page-header">
                    <h2>{{ skill.Name || 'Skill name' }}</h2>
                </div>

                <div class="form-group">
                    <label for="Name">Name</label>
                    <input class="form-control" v-model="skill.Name" :disabled="mode == 'read'" />
                </div>

                <h3>Employees</h3>

                <paginated-list
                    v-if="mode == 'edit'"
                    :itemsFetcher="employeesFetcher"
                    :itemDrawer="newEmployeeDrawer"
                    :itemOnClick="addEmployee"
                    :hasSearcher="true">
                </paginated-list>
                
                <paginated-list
                    :itemsFetcher="skillEmployees"
                    :itemDrawer="ownedEmployeeDrawer"
                    :itemOnClick="removeEmployee">
                </paginated-list>

                <div v-if="mode == 'read'">
                    <button type="button" class="btn btn-primary" v-on:click="edit">Edit</button>
                    <button type="button" class="btn btn-danger" v-on:click="remove">Delete</button>
                </div>

                <div v-if="mode == 'edit'">
                    <button type="button" class="btn btn-primary"
                        v-on:click="save">Save</button>
                    <button type="button" class="btn btn-default" v-on:click="discardChanges">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import toastr from 'toastr';
    import Utils from '../utils';
    import { getInstance } from '../service-locator';
    import PaginatedList from './PaginatedList.vue';
    import PaginatedData from '../models/PaginatedData';
    import EmployeeService from '../services/employee-service';
    import SkillService from '../services/skill-service';

    const employeeService = getInstance<EmployeeService>('EmployeeService');
    const skillService = getInstance<SkillService>('SkillService');

    interface ComponentData {
        employeesFetcher: (keywords: string, page: number, pageSize: number) => Promise<any>,
        loading: boolean,
        mode: string,
        newEmployeeDrawer: (employee: any) => string
        notFound: boolean,
        ownedEmployeeDrawer: (employee: any) => string,
        skill: any,
        skillEmployees: (keywords: string, page: number, pageSize: number) => Promise<any>,
    }

    export default {
        components: {
            PaginatedList
        },
        data() {
            return {
                mode: 'read',
                notFound: false,
                loading: true,
                skill: {
                    Id: 0,
                    Name: '',
                    Employees: []
                },
                skillEmployees: (keywords, page, pageSize) => {
                    var component = <ComponentData>this;
                    return Promise.resolve(new PaginatedData(component.skill.Employees));
                },
                employeesFetcher: (keywords, page, pageSize) => {
                    var component = <ComponentData>this;

                    return keywords ?
                        Utils.stallPromise(employeeService.getAll(keywords, page, pageSize), 500)
                        .then((paginatedContent : any) => {
                            paginatedContent.Items =
                                Utils.leftOuterJoin(paginatedContent.Items, component.skill.Employees, 'Id');
                            return paginatedContent;
                        }) :
                        Promise.resolve([]);
                },
                ownedEmployeeDrawer: employee => {
                    var component = <ComponentData>this;

                    if (component.mode == 'read') {
                        return employee.Name;
                    }
                    return `<i class="fa fa-times text-danger"></i> ${employee.Name}`;
                },
                newEmployeeDrawer: employee => `<i class="fa fa-plus text-success"></i> ${employee.Name}`
            };
        },
        created() {
            var component = <ComponentData>this;

            if (this.$route.path.indexOf('/edit/') > -1) {
                component.mode = 'edit';
            }

            var skillId = this.$route.params.id;
            if (skillId != 0) {
                Utils.stallPromise(skillService.getById(skillId), 1000)
                .then(skill => {
                    if (skill) {
                        component.skill = skill;
                        component.skillEmployees = (keywords, page, pageSize) =>
                            Promise.resolve(new PaginatedData(component.skill.Employees));
                    }
                    else {
                        component.notFound = true;
                    }
                    component.loading = false;
                });
            }
            else {
                component.loading = false;
            }
        },
        methods: {
            addEmployee(employee) {
            var component = <ComponentData>this;

            component.skill.Employees.push(employee);
                return {
                    clearKeywords: true
                };
            },
            discardChanges() {
                var component = <ComponentData>this;
                
                if (component.skill.Id != 0) {
                    this.$router.push(`/skill/${component.skill.Id}`);
                }
                else {
                    this.$router.push('/skills');
                }
            },
            edit() {
                var component = <ComponentData>this;
                this.$router.push(`/skill/edit/${component.skill.Id}`);
            },
            removeEmployee(employee) {
                var component = <ComponentData>this;

                if (component.mode == 'edit') {
                    component.skill.Employees = component.skill.Employees.filter(s => s.Id != employee.Id);
                    component.skillEmployees = (keywords, page, pageSize) =>
                        Promise.resolve(new PaginatedData(component.skill.Employees));
                }
                else {
                    this.$router.push(`/employee/${employee.Id}`);
                }
            },
            remove() {
                var component = <ComponentData>this;

                Utils.actionModal(
                    '<div>Are you sure you want to delete ' + component.skill.Name + '?</div>',
                    'Delete')
                .then(acceptance => {
                    console.log(acceptance)
                    if (acceptance) {
                        skillService.remove(component.skill.Id)
                        .then(skill => {
                            this.$router.push('/skills');
                        });
                    }
                });
            },
            save() {
                var component = <ComponentData>this;

                if (component.skill.Name && component.skill.Name.length > 2) {
                    skillService.save(component.skill).then(skill => {
                        this.$router.push(`/skill/${skill.Id}`);
                    });
                }
                else {
                    toastr.error(
                        'A skill must have a name with at least three characters',
                        'Invalid name',
                        {timeOut: 4000});
                }
            }
        }
    }
</script>
