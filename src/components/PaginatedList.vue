<template>
    <div class="loader-wrapper">
        <div class="loader-animation">
            <div class="sk-chasing-dots">
                <div class="sk-child sk-dot1"></div>
                <div class="sk-child sk-dot2"></div>
            </div>
        </div>
        <div :class="{ 'paginated-list': true, 'loaded-content': true, 'loading' : loading }">
            <div :class="{ 'input-group searcher': true, 'visible': hasSearcher }">
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
                <input class="form-control" v-model="keywords" v-on:keyup="search" />
                <span class="fa fa-times clear-icon" v-if="keywords" v-on:click="clearKeywords()"></span>
            </div>
            <ul class="list-group clickable">
                <li v-for="item in data.Items"
                    v-bind:key="itemKey(item)"
                    v-on:click="_itemOnClick(item)"
                    v-html="itemDrawer(item)"
                    class="list-group-item">
                </li>
            </ul>
            <div :class="{ 'pagination-bar': true, 'visible': hasPagination }">

                <ul class="pagination clickable">
                    <li :class="[pageOffset - pages.length >= 0 ? 'enabled' : 'disabled']">
                        <span class="page-button" v-on:click="pageUpdated('previous')">&laquo;</span>
                    </li>
                    <li v-for="pageNumber in pages" v-bind:key="pageNumber" v-on:click="pageUpdated(pageNumber)"
                        :class="[currentPage == pageNumber ? 'active' : 'enabled']">
                            <span class="page-button"> {{ pageOffset + pageNumber }}</span>
                    </li>
                    <li :class="[pageOffset + pages.length < data.TotalPages ? 'enabled' : 'disabled']">
                        <span class="page-button" v-on:click="pageUpdated('next')">&raquo;</span>
                    </li>
                </ul>

                <div class="dropup pull-right">
                    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        {{pageSize}} <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <li v-for="size in pageSizes" v-bind:key="size" class="text-right"
                            v-on:click="pageSizeUpdated(size)">
                            <span class="dropdown-option">{{size}}</span>
                        </li>
                    </ul>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import PaginatedData from '../models/PaginatedData';

    interface ComponentData {
        currentPage: number,
        clearKeywords: Function,
        data: PaginatedData<any>,
        hasPagination: Boolean
        hasSearcher: Boolean,
        itemDrawer: Function,
        itemKey: Function,
        itemOnClick: Function,
        itemsFetcher: (keywords: string, page: number, pageSize: number) => Promise<any>,
        keywords: string,
        loading: boolean,
        maxPages: number,
        pageOffset: number,
        pages: Array<number>,
        pageSize: number,
        pageSizes: Array<number>,
        searcherTimeout: number,
        update: Function
    }

    export default {
        props: {
            itemsFetcher: {
                type: Function,
                default: () => Promise.resolve([])
            },
            itemKey: {
                type: Function,
                default: (item) => item.Id
            },
            itemOnClick: {
                type: Function,
                default: (item) => {}
            },
            itemDrawer: {
                type: Function,
                default: (item) => item
            },
            hasSearcher: {
                type: Boolean,
                default: false
            },
            hasPagination: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                keywords: undefined,
                searcherTimeout: undefined,
                
                maxPages: 5,
                pages: [1, 2, 3, 4, 5],
                currentPage: 1,
                pageOffset: 0,

                pageSizes: [10, 15, 25],
                pageSize: 10,

                data: new PaginatedData([]),

                loading: false
            };
        },
        watch: {
            itemsFetcher (newVal, oldVal) {
                var component = <ComponentData>this;                
                this.update();
            }
        },
        created() {
            var component = <ComponentData>this;
            component.update();
        },
        methods: {
            update () {
                var component = <ComponentData>this;

                component.loading = true;
                component.itemsFetcher(component.keywords, component.currentPage - 1 + component.pageOffset, component.pageSize)
                .then((paginatedData : PaginatedData<any>) => {
                    component.data = paginatedData;
                    var availablePages = component.data.TotalPages - component.pageOffset;
                    var pageBarPages = Math.min(availablePages, component.maxPages);
                    component.pages = [];
                    for (var i = 1; i <= pageBarPages; ++i) {
                        component.pages.push(i);
                    }
                    component.loading = false;
                });
            },
            search() {
                var component = <ComponentData>this;

                component.currentPage = 1;
                component.pageOffset = 0;
                if (component.searcherTimeout) {
                    clearTimeout(component.searcherTimeout);
                }
                component.searcherTimeout = setTimeout(component.update, 400);
            },
            pageUpdated (newPageNumber) {
                var component = <ComponentData>this;
                
                var isPageChange = false;
                if (!isNaN(newPageNumber)) {
                    isPageChange = component.currentPage != newPageNumber;
                    component.currentPage = newPageNumber;
                }
                else if (newPageNumber === 'previous' && (component.pageOffset - component.pages.length) >= 0) {
                    isPageChange = true;
                    component.currentPage = 1;
                    component.pageOffset -= component.pages.length;
                }
                else if (newPageNumber === 'next' && (component.pageOffset + component.pages.length) < component.data.TotalPages) {
                    isPageChange = true;
                    component.currentPage = 1;
                    component.pageOffset += component.pages.length;
                }

                if (isPageChange) {
                    component.update();
                }
            },
            pageSizeUpdated (size) {
                var component = <ComponentData>this;
                
                var isSizeChange = component.pageSize != size;
                component.pageSize = size;
                if (isSizeChange) {
                    component.pageOffset = 0;
                    component.currentPage = 1;
                    component.update();
                }
            },
            clearKeywords() {
                var component = <ComponentData>this;
                
                component.keywords = undefined;
                component.update();
            },
            _itemOnClick(item) {
                var component = <ComponentData>this;
                
                var additionalActions = component.itemOnClick(item);
                if (additionalActions) {
                    if (additionalActions.clearKeywords) {
                        component.clearKeywords();
                    }
                }
            }
        }
    };
</script>
