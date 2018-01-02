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
                    <h2>{{ employee.Name || 'Employee name' }}</h2>
                </div>

                <div class="form-group">
                    <label for="Name">Name</label>
                    <input class="form-control" v-model="employee.Name" :disabled="mode == 'read'" />
                </div>

                <h3>Skills</h3>

                <paginated-list
                    v-if="mode == 'edit'"
                    :itemsFetcher="skillsFetcher"
                    :itemDrawer="newSkillDrawer"
                    :itemOnClick="addSkill"
                    :hasSearcher="true">
                </paginated-list>
                
                <paginated-list
                    :itemsFetcher="employeeSkills"
                    :itemDrawer="ownedSkillDrawer"
                    :itemOnClick="removeSkill">
                </paginated-list>

                <!-- Read actions -->
                <div v-if="mode == 'read'">
                    <button type="button" class="btn btn-primary" v-on:click="edit">Edit</button>
                    <button type="button" class="btn btn-danger" v-on:click="remove">Delete</button>
                </div>

                <!-- Edit actions -->
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
        employee: any,
        employeeSkills: (keywords: string, page: number, pageSize: number) => Promise<any>,
        loading: boolean,
        mode: string,
        newSkillDrawer: (employee: any) => string
        notFound: boolean,
        ownedSkillDrawer: (employee: any) => string,
        skillsFetcher: (keywords: string, page: number, pageSize: number) => Promise<any>,
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
                employee: {
                    Id: 0,
                    Name: '',
                    Skills: []
                },
                employeeSkills: (keywords, page, pageSize) => {
                    var component = <ComponentData>this;
                    return Promise.resolve(new PaginatedData(component.employee.Skills));
                },
                skillsFetcher: (keywords, page, pageSize) => {
                    var component = <ComponentData>this;
                    return keywords ?
                        Utils.stallPromise(skillService.getAll(keywords, page, pageSize), 500)
                        .then((paginatedContent : any) => {
                            paginatedContent.Items =
                                Utils.leftOuterJoin(paginatedContent.Items, component.employee.Skills, 'Id');
                            return paginatedContent;
                        }) :
                        Promise.resolve([]);
                },
                ownedSkillDrawer: skill => {
                    var component = <ComponentData>this;
                    if (component.mode == 'read') {
                        return skill.Name;
                    }
                    return `<i class="fa fa-times text-danger"></i> ${skill.Name}`;
                },
                newSkillDrawer: skill => `<i class="fa fa-plus text-success"></i> ${skill.Name}`
            };
        },
        created() {
            var component = <ComponentData>this;

            if (this.$route.path.indexOf('/edit/') > -1) {
                component.mode = 'edit';
            }

            var employeeId = this.$route.params.id;
            if (employeeId != 0) {
                Utils.stallPromise(employeeService.getById(employeeId), 1000)
                .then(employee => {
                    if (employee) {
                        component.employee = employee;
                        component.employeeSkills = (keywords, page, pageSize) =>
                            Promise.resolve(new PaginatedData(component.employee.Skills));
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
            addSkill(skill) {
                var component = <ComponentData>this;

                component.employee.Skills.push(skill);
                return {
                    clearKeywords: true
                };
            },
            discardChanges() {
                var component = <ComponentData>this;

                if (component.employee.Id != 0) {
                    this.$router.push(`/employee/${component.employee.Id}`);
                }
                else {
                    this.$router.push('/employees');
                }
            },
            edit() {
                var component = <ComponentData>this;
                this.$router.push(`/employee/edit/${component.employee.Id}`);
            },
            removeSkill(skill) {
                var component = <ComponentData>this;

                if (component.mode == 'edit') {
                    component.employee.Skills = component.employee.Skills.filter(s => s.Id != skill.Id);
                    component.employeeSkills = (keywords, page, pageSize) =>
                        Promise.resolve(new PaginatedData(component.employee.Skills));
                }
                else {
                    this.$router.push(`/skill/${skill.Id}`);
                }
            },
            remove() {
                var component = <ComponentData>this;

                Utils.actionModal(
                    '<div>Are you sure you want to delete ' + component.employee.Name + '?</div>',
                    'Delete')
                .then(acceptance => {
                    if (acceptance) {
                        employeeService.remove(component.employee.Id)
                        .then(employee => {
                            this.$router.push('/employees');
                        });
                    }
                });
            },
            save() {
                var component = <ComponentData>this;

                if (component.employee.Name && component.employee.Name.length > 2) {
                    employeeService.save(component.employee).then(employee => {
                        this.$router.push(`/employee/${employee.Id}`);
                    });
                }
                else {
                    toastr.error(
                        'An employee must have a name with at least three characters',
                        'Invalid name',
                        {timeOut: 4000});
                }
            }
        }
    }
</script>
