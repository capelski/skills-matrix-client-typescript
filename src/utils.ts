import * as basicModal from 'basicmodal';

function actionModal(text: string, actionName: string) : Promise<Boolean> {
    return new Promise(function(resolve, reject) {
        basicModal.show({
            body: text,
            buttons: {
                cancel: {
                    title: 'Cancel',
                    fn: function() {
                        basicModal.close();
                        resolve(false);
                    }
                },
                action: {
                    title: actionName,
                    fn: function() {
                        basicModal.close();
                        resolve(true);
                    }
                }
            }
        });
    });
}

function leftOuterJoin<T>(a: Array<T>, b: Array<T>, propertyName: string) : Array<T> {
    var _leftOuterJoin = a.filter(aElement =>
        !b.some(bElement => aElement[propertyName] === bElement[propertyName]));
    return _leftOuterJoin;
}

function stallPromise<T>(promise: Promise<T>, minimumTime: number) : Promise<T> {
    return Promise.all([promise, wait(minimumTime)])
    .then((results) => results[0]);
}

function wait(time: number) : Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
    });
}

export default {
    actionModal,
    leftOuterJoin,
    stallPromise,
    wait
};
