import $ from 'jquery';
import 'jquery-ui';
import Stamp from './stamp.js';
import * as Settings from '../feature/settings.js';

var stampDescription = 'Shiftで削除、⌘ですぐ送信';

export default class StampList {
    constructor() {
        this.base = Settings.get('w-stamp-url');
        this.update();
    }

    render() {
        this.$el = $('<div class="stampList toolTip toolTipWhite mainContetTooltip" role="tooltip" style="display:none;"><div class="_cwTTTriangle toolTipTriangle toolTipTriangleWhiteBottom"></div></div>');
        this.$el.appendTo($('body'));
        this.$Cel = this.$el.cwToolTip({open: function() {}});

        this.$button = $('<li role="button" class="_showDescription" aria-label="すたんぷ"><span class="icoFontContentOpen icoSizeLarge"></span></li>')
            .on('click', () => {
                this.show();
            });
        this.$button.appendTo($("#_chatSendTool"));

        this.$gallery = $('<ul class="stampGallery clearfix" style="max-width:600px;"></ul>');
        this.$gallery.appendTo(this.$el);

        this.$desc = $('<div class="tooltipFooter">'+stampDescription+'</div>');
        this.$desc.appendTo(this.$el);
    }

    remove() {
        if (this.$el) {
            this.$el.remove();
            this.$button.remove();
        }
    }

    update() {
        let list = Settings.get('w-stamp-list', []);
        let ret = {};
        for (var i = 0; i < list.length; i++) {
            ret[list[i]] =new Stamp(this.base, list[i]);
        }
        this.list = ret;
        return ret;
    }

    show() {
        this.update();
        this.$desc.text(stampDescription);
        this.$gallery.empty();

        for (var i in this.list) {
            let stampButton = $("<li data-stamp-key=\""+this.list[i].key+"\" style=\"float:left;width:80px;height:80px;\"><img src=\""+this.list[i].element.src+"\" style=\"max-width:80px;max-height:80px;\"></li>");
            ((stampButton, stamp) => {
                stampButton.click(() => {
                    if(CW.view.key.shift){
                        stamp.remove(true);
                        this.hide();
                        this.show();
                    }else if(CW.view.key.command){
                        this.hide();
                        CS.view.sendMessage("(stamp "+stamp.key+")", !0);
                    }else{
                        $C("#_chatText").focus();
                        CS.view.setChatText("(stamp "+stamp.key+")", !0);
                        this.hide();
                    }
                }).mouseenter(() => {
                    this.$desc.text(stamp.key);
                }).mouseleave(() => {
                    this.$desc.text(stampDescription);
                });
            })(stampButton, this.list[i]);
            this.$gallery.append(stampButton);
        }
        this.$gallery.sortable({
            placeholder:'placeholder',
            update:() => {
                let list = [];
                this.$gallery.children().each(function(){
                    var key = $(this).attr('data-stamp-key');
                    list.push(key);
                });
                Settings.set('w-stamp-list', list);
            }
        });
        this.$gallery.disableSelection();

        this.$Cel.open(this.$button);
    }

    hide() {
        this.$Cel.close();
    }
};
