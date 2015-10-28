import $ from 'jquery';
import * as Snippet from '../feature/snippet.js';

$(function () {
    var oldCSVchatTextKeyUp = CS.view.chatTextKeyUp;
    CS.view.chatTextKeyUp = function (b) {
        let keyCode = b.keyCode;
        Snippet.apply(keyCode);
        oldCSVchatTextKeyUp.apply(this, arguments);
    };
});
