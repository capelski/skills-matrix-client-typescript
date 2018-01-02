export default class PaginatedData<T> {
    CurrentPage: number;
    Items: Array<T>;
    TotalPages: number;
    TotalRecords: number;

    constructor(items: Array<T>) {
        items = items || [];

        this.CurrentPage = 0;
        this.Items = items;
        this.TotalPages = 1;
        this.TotalRecords = items.length;
    }
}