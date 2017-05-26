/* */ 
const passwordStrength = function(options = {}) {

    const errors = {
            prefix: 'passwordStrength: ',
            noRulesSet: 'No rules set.'
        },
        defaults = {
            inputEl: null, 
            wrapperSelector: '.js-pwstrength',
            headingClass: 'password-strength__heading',
            headingText: 'Password must:',
            listClass: 'password-strength__list',
            listItemDisplayClass: 'password-strength__list-item', 
            listItemJsClass: 'js-pwstrength-list-item',
            untestedClass: 'is-untested',
            passingClass: 'is-passing',
            failingClass: 'is-failing',
            inputEvent: 'keyup',
            untestedMsg: 'untested',
            passingMsg: 'passing',
            failingMsg: 'failing',
            logErrors: false,
            onUntestedCallback: null,
            onFailingCallback: null,
            onPassingCallback: null,
            rules: [
                {
                    label: 'Be at least 8 characters',
                    test: function(val) {
                        return val.length >= 8;
                    }
                },
                {
                    label: 'Contain at least 1 uppercase character',
                    test: function(val) {
                        return val.replace(/[^A-Z]/g, "").length > 0;
                    }
                },
                {
                    label: 'Contain at least 1 numerical character',
                    test: function(val) {
                        return val.match(/\d+/g) !== null;
                    }
                },
                {
                    label: 'Contain at least 1 special character',
                    test: function(val) {
                        return /[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(val);
                    }
                }
            ]
        };

    let wrapperEl,
        listItemEls,
        settings;

    function init() {
        settings = Object.assign({}, defaults, options);
        wrapperEl = document.querySelector(settings.wrapperSelector);
        if ((wrapperEl) && (wrapperEl.innerHTML === '')) {
            if (rulesAreSet()) {
                render();
                if (settings.inputEl !== null) {
                    bindEvents();
                }
            } else {
                logError(errors.noRulesSet);
            }
        }
    };

    function bindEvents() {
        settings.inputEl.addEventListener(settings.inputEvent, onInputEvent);
    };

    function onInputEvent(e) {
        test(e.target.value)
            .then(function(response) {
                fireCallback(settings.onPassingCallback, response);
            })
            .catch(function(error) {
                fireCallback(settings.onFailingCallback, error);
            });
    };

    function render() {
        wrapperEl.classList.add(settings.untestedClass);
        let content = `
            <h3 class="${settings.headingClass}">${settings.headingText}</h3>
            <ul class="${settings.listClass}">
                ${renderListItems()}
            </ul>
        `;
        wrapperEl.insertAdjacentHTML('afterbegin', content);
        listItemEls = Array.from(wrapperEl.querySelectorAll('.' + settings.listItemJsClass));
    };

    function renderListItems() {
        let output = '';
        settings.rules.forEach(function(rule) {
            output += `
                <li class="${settings.listItemDisplayClass} ${settings.listItemJsClass} ${settings.untestedClass}">${rule.label}</li>
            `
        });
        return output;
    };

    function test(val = null, validateWrapper = true) {
        return new Promise(function(resolve, reject) {
            let hasFailure = false;
            wrapperEl.classList.remove(settings.untestedClass);
            if ((!val) || (val.length === 0)) {
                wrapperEl.classList.remove(settings.failingClass, settings.passingClass);
                if (validateWrapper === true) {
                    wrapperEl.classList.add(settings.untestedClass);
                }
                listItemEls.forEach(function(el) {
                    el.classList.add(settings.untestedClass);
                    el.classList.remove(settings.failingClass, settings.passingClass);
                });
                fireCallback(settings.onUntestedCallback, settings.untestedMsg);
                hasFailure === false;
            } else {
                let allRulesPass = true;
                settings.rules.forEach(function(rule, index) {
                    listItemEls[index].classList.remove(settings.untestedClass);
                    let ruleDoesPass = rule.test(val) === true;
                    if (ruleDoesPass) {
                        listItemEls[index].classList.remove(settings.failingClass);
                        listItemEls[index].classList.add(settings.passingClass);
                    } else {
                        allRulesPass = false;
                        listItemEls[index].classList.add(settings.failingClass);
                        listItemEls[index].classList.remove(settings.passingClass);
                    }
                    return ruleDoesPass;
                });
                if (allRulesPass) {
                    wrapperEl.classList.remove(settings.failingClass);
                    if (validateWrapper === true) {
                        wrapperEl.classList.add(settings.passingClass);
                    }
                    fireCallback(settings.onPassingCallback, settings.passingMsg);
                    resolve(settings.passingMsg);
                } else {
                    wrapperEl.classList.remove(settings.passingClass, settings.failingClass);
                    if (validateWrapper === true) {
                        wrapperEl.classList.add(settings.failingClass);
                    }
                    fireCallback(settings.onFailingCallback, settings.failingMsg)
                    reject(settings.failingMsg);                    
                }
            }
        });
    };

    function rulesAreSet() {
        return settings.rules && Array.isArray(settings.rules) && settings.rules.length > 0;
    };

    function logError(msg, method = 'log') {
        if (settings.logErrors === true) {
            console[method](errors.prefix + msg);
        }
    };

    function fireCallback(callback, msg) {
        if (callback !== null) {
            callback(msg);
        }
    };

    function destroy() {
        if (settings.inputEl !== null) {
            settings.inputEl.removeEventListener(settings.inputEvent, onInputEvent);
        }
        wrapperEl.innerHTML = '';
    };

    init();

    return {
        test: test,
        destroy: destroy
    };

};

export default passwordStrength;