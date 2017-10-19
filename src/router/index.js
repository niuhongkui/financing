import Vue from 'vue'
import Router from 'vue-router'

import NotFoundComponent from '@/components/NotFoundComponent'
import Loan from '@/components/Loan'
import LoanIndex from '@/components/LoanIndex'
import LoanDetail from '@/components/LoanDetail'
import LoanAdd from '@/components/LoanAdd'
import LoanContract from '@/components/Loancontract'
import LoanPledgedCar from '@/components/LoanPledgedCar'
import LoanFee from '@/components/LoanFee'
import LoanEdit from '@/components/LoanEdit'

import Dash from '@/components/Dash'
import credit from '@/components/credit'
import creditAdd from '@/components/creditAdd'
import creditDetail from '@/components/creditDetail'
import CreditSplit from '@/components/CreditSplit'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    linkActiveClass: 'active',
    routes: [{
            path: '/loan',
            name: 'Loan',
            alias: '',
            meta: {
                breadcrumb: '自采融资管理'
            },
            component: Loan,
            children: [{
                    path: 'index',
                    name: 'index',
                    component: LoanIndex,
                    meta: {
                        breadcrumb: '金融贷款'
                    }
                },
                {
                    path: 'detail/:id',
                    name: 'detail',
                    component: LoanDetail,
                    meta: {
                        breadcrumb: '详情',
                        back: true
                    }
                },
                {
                    path: 'add',
                    name: 'add',
                    component: LoanAdd,
                    meta: {
                        breadcrumb: '新增',
                        back: true
                    }
                },
                {
                    path: 'contract/:code',
                    name: 'contract',
                    component: LoanContract,
                    meta: {
                        breadcrumb: '新增合同',
                        back: true
                    }
                },
                {
                    path: 'pledgedcar/:id/:code',
                    name: 'pledgedcar',
                    component: LoanPledgedCar,
                    meta: {
                        breadcrumb: '质押车辆',
                        back: true
                    }
                },
                {
                    path: 'LoanFee/:id/:code',
                    name: 'LoanFee',
                    component: LoanFee,
                    meta: {
                        breadcrumb: '费用管理',
                        back: true
                    }
                }
            ]
        },
        {
            path: '/finance',
            alias: '/',
            component: Dash,
            meta: {
                breadcrumb: '自采融资管理'
            },
            children: [{
                    path: 'credit',
                    name: 'credit',
                    component: credit,
                    meta: {
                        breadcrumb: '金融授信',
                        back: true
                    }
                },
                {
                    path: 'creditAdd',
                    name: 'creditAdd',
                    component: creditAdd,
                    meta: {
                        breadcrumb: '新增金融授信',
                        back: true
                    }
                },
                {
                    path: 'creditDetail/:id',
                    name: 'creditDetail',
                    component: creditDetail,
                    meta: {
                        breadcrumb: '详情',
                        back: true
                    }
                },
                {
                    path: 'creditSplit/:id',
                    name: 'creditSplit',
                    component: CreditSplit,
                    meta: {
                        breadcrumb: '拆分额度',
                        back: true
                    }
                }
            ]
        },
        { path: '*', component: NotFoundComponent }
    ]
})


// WEBPACK FOOTER //
// ./src/router/index.js