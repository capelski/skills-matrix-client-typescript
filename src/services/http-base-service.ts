import toastr from 'toastr';

export default class HttpBaseService {
    
    apiUrl = process.env.baseApiUrl;
    corsMode = process.env.corsMode;

    removeEntity<T>(url: string) : Promise<T> {
        var options = <RequestInit>{
            method: 'DELETE',
            mode: 'cors'
        };

        return fetch(this.apiUrl + url, options)
        .then(response => <Promise<T>> response.json())
        .catch(error => {
            toastr.error('A network error ocurred', 'Oops!', {timeOut: 4000});
            return null;
        });
    }

    getRequest<T>(url: string, parameters: any, defaultValue: T) : Promise<T> {        
        var options = <RequestInit>{
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        };

        if (parameters) {
            url += '?';
            for (var key in parameters) {
                var parameter = parameters[key];
                if (parameter) {
                    url += (key + '=' + encodeURIComponent(parameter) + '&');
                }
            }
            url = url.substring(0, url.length - 1);
        }
        
        return fetch(this.apiUrl + url, options)
        .then(response => <Promise<T>> response.json())
        .catch(error => {
            toastr.error('A network error ocurred', 'Oops!', {timeOut: 4000});
            return defaultValue;
        });
    }

    saveEntity<T>(url: string, entitity: any) : Promise<T> {
        var options = <RequestInit>{
            method: entitity.Id == 0 ? 'POST' : 'PUT',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(entitity),
            mode: 'cors'
        };

        return fetch(this.apiUrl + url, options)
        .then(response => <Promise<T>> response.json())
        .catch(error => {
            toastr.error('A network error ocurred', 'Oops!', {timeOut: 4000});
            return null;
        });
    }
};
    