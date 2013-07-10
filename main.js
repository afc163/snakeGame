var $AJS = {};
(function ($AJS) {
    $AJS.$ = function (str) {
        if (typeof str == "string")
            return document.getElementById(str);
        return str;
    };

    $AJS.C = function (str) {
        if (typeof str == "string")
            return document.createElement(str);
        return str;
    };

    $AJS.TN = function (str) {
        if (typeof str == "string")
            return document.getElementsByTagName(str);
        return str;
    };

    $AJS.CLZ = function (tg, clz) {
        var rs = [];
        clz = " " + clz + " ";
        var cldr = document.getElementsByTagName(tg),
            len = cldr.length;
        for (var i = 0; i < len; ++i) {
            var o = cldr[i];
            if (o.nodeType == 1) {
                var ecl = " " + o.className + " ";
                if (ecl.indexOf(clz) != -1) {
                    rs[rs.length] = o;
                }
            }
        }
        return rs;
    };

    $AJS.cloneObject = function (obj) {
        if (typeof (obj) != 'object' || obj == null) return obj;
        var newObj = new Object();
        for (var i in obj)
            newObj[i] = arguments.callee(obj[i]);
        return newObj;
    };

    $AJS.prompt = function (parent, id, content, buttonText, callback) {
        parent = parent || document;
        if ($AJS.$(id) == null) {
            var promptDiv = $AJS.C("div");
            promptDiv.id = id;
            promptDiv.style.position = "absolute";
            promptDiv.style.width = "200px";
            promptDiv.style.overflow = "hidden";
            promptDiv.style.top = "50%";
            promptDiv.style.left = "50%";
            promptDiv.style.marginTop = "-" + parseInt(promptDiv.style.height) / 2 + "px";
            promptDiv.style.marginLeft = "-" + parseInt(promptDiv.style.width) / 2 + "px";
            promptDiv.style.zIndex = "99";
            promptDiv.style.color = "#333";
            promptDiv.style.fontSize = "12px";
            promptDiv.style.background = "#F4F4F4";
            promptDiv.style.padding = "10px";
            promptDiv.style.textAlign = "center";
            promptDiv.style.border = "5px solid #2F3253";
            promptDiv.innerHTML = "<span>" + content + "</span>";
            var button = $AJS.C("div");
            button.style.margin = "5px auto 0";
            button.style.cursor = "pointer";
            button.style.width = "80px";
            button.style.padding = "4px";
            button.style.background = "#7BCC58";
            button.style.border = "1px solid #439F27";
            button.style.color = "#fff";
            button.style.fontSize = "12px";
            button.innerHTML = buttonText || "确定";
            button.onclick = function () {
                $AJS.$(id).style.display = "none";
                callback.call();
            };
            promptDiv.appendChild(button);
            parent.appendChild(promptDiv);
        } else {
            $AJS.$(id).innerHTML = "<span>" + content + "</span>";
        }
    };
    $AJS.showTip = function (parent, id, content, callback) {
        parent = parent || document;
        callback = callback || function () {
            var showtip = $AJS.$(id);
            var oldSize = parseInt(showtip.style.fontSize) || 12;
            showtip.style.fontSize = oldSize + "px";
            showtip.style.top = showtip.style.top || "14px";
            showtip.style.right = showtip.style.right || "10px";

            var bigSize = 22;
            var timerBigger = setInterval(function () {
                if (parseInt(showtip.style.fontSize) >= bigSize) {
                    clearInterval(timerBigger);
                    return;
                }
                showtip.style.fontSize = (parseInt(showtip.style.fontSize) + 2) + "px";
                showtip.style.top = (parseInt(showtip.style.top) - 1) + "px";
                showtip.style.right = (parseInt(showtip.style.right) - 1) + "px";
                console.info(showtip.style.fontSize + " " + showtip.style.top + " " + showtip.style.right);
                //debugger;
            }, 10);
            var timerSmaller = setInterval(function () {
                if (parseInt(showtip.style.fontSize) <= oldSize) {
                    clearInterval(timerSmaller);
                    return;
                }
                showtip.style.fontSize = (parseInt(showtip.style.fontSize) - 2) + "px";
                showtip.style.top = (parseInt(showtip.style.top) + 1) + "px";
                showtip.style.right = (parseInt(showtip.style.right) + 1) + "px";
            }, 30);
        };
        if ($AJS.$(id) == null) {
            var tip = $AJS.C("div");
            tip.id = id;
            tip.style.position = "absolute";
            tip.style.top = "14px";
            tip.style.right = "10px";
            tip.style.fontSize = "12px";
            tip.style.zIndex = "100";
            tip.style.color = "#888";
            snakeGame.getWin().appendChild(tip);
        }
        $AJS.$(id).innerHTML = content;
        callback.call();
    };
})($AJS);
