var $aop = function () {
    function beforeAdviceMethod(method, advice) {
        return function () {
            var args = arguments;
            advice.apply(this, args);
            method.apply(this, args);
        }
    }
    function throwAdviceMethod(method, advice) {
        return function () {
            var args = Array.prototype.slice.apply(arguments);
            try {
                method.apply(this, args);
            } catch (e) {                
                advice.apply(this, [e]);
            }
         }
    }
    function afterAdviceMethod(method, advice) {
        return function () {
            var args = arguments;
            method.apply(this, args);
            advice.apply(this, args);
        }
    }
    function aroundAdviceMethod(method, beforeAdvice, afterAdvice) {
        return function () {
            var args = arguments;
            beforeAdvice.apply(this, args);
            method.apply(this, args);
            afterAdvice.apply(this, args);
        }
    }

    function getObjectMethods(obj) {
        if (typeof obj === "function") {
            return;
        }
        var methodNames = Object.getOwnPropertyNames(obj);
        var methods = [];
        var methodCount = methodNames.length;
        for (var i = 0; i < methodCount; i++) {
            var method = obj[methodNames[i]];
            if (typeof method === "function") {
                methods.push({
                    name: methodNames[i],
                    method: method,
                    context: obj
                });
            }

        }
        return methods;
    }

    function applyBeforeAdvice(methods, advice) {
        if (typeof methods === "function") {
            this[methods] = beforeAdviceMethod(methods, advice);
            return;
        }
        for (var i = 0; i < methods.length; i++) {
            var methodDetail = methods[i];
            methodDetail.context[methodDetail.name] = beforeAdviceMethod(methodDetail.method, advice);
        }
    }

    function applyAfterAdvice(methods, advice) {
        for (var i = 0; i < methods.length; i++) {
            var methodDetail = methods[i];
            methodDetail.context[methodDetail.name] = afterAdviceMethod(methodDetail.method, advice);
        }
    }

    function applyAroundAdvice(methods, beforeAdvice, afterAdvice) {
        for (var i = 0; i < methods.length; i++) {
            var methodDetail = methods[i];
            methodDetail.context[methodDetail.name] = aroundAdviceMethod(methodDetail.method, beforeAdvice, afterAdvice);
        }
    }
    function applyThrowAdvice(methods, advice) {
        for (var i = 0; i < methods.length; i++) {
            var methodDetail = methods[i];
            methodDetail.context[methodDetail.name] = throwAdviceMethod(methodDetail.method, advice);
        }
    }

    return {
        beforeAdvice: function (obj, advice) {
            var methods = getObjectMethods(obj);
            applyBeforeAdvice(methods, advice);

        },
        afterAdvice: function (obj, advice) {
            var methods = getObjectMethods(obj);
            applyAfterAdvice(methods, advice);

        },
        aroundAdvice: function (obj, beforeAdvice, afterAdvice) {
            var methods = getObjectMethods(obj);
            applyAroundAdvice(methods, beforeAdvice, afterAdvice);

        },
        throwAdvice: function (obj, advice) {
            var methods = getObjectMethods(obj);
            applyThrowAdvice(methods, advice);
        }
    };
}();
