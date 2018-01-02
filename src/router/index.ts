import Vue from 'vue';
import Router from 'vue-router';
import { RouterOptions } from 'vue-router/types/router';
import Home from '@/components/Home.vue';
import Employees from '@/components/Employees.vue';
import Skills from '@/components/Skills.vue';
import EmployeeDetails from '@/components/EmployeeDetails.vue';
import SkillDetails from '@/components/SkillDetails.vue';

Vue.use(Router);

export default new Router(<RouterOptions>{
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/employees',
            component: Employees
        },
        {
            path: '/skills',
            component: Skills
        },
        {
            path: '/employee/:id',
            component: EmployeeDetails
        },
        {
            path: '/employee/edit/:id',
            component: EmployeeDetails
        },
        {
            path: '/skill/:id',
            component: SkillDetails
        },
        {
            path: '/skill/edit/:id',
            component: SkillDetails
        }
    ]
});
