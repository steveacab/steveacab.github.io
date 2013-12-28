/* =========================================================
 * fancyBoxPreview @VERSION 1.0
 * =========================================================
 * Copyright (c) 2012 Alexander Mishurov
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Alexander Mishurov (ammishurov at gmail dot com)
 * http://fancy.mishurov.com/
 * ========================================================= */


!function ($) {

    "use strict"; // jshint ;_;

    /* FANCYBOXPREVEW CLASS DEFINITION
     * ========================= */

    var FancyBoxPreview = function (element, options) {
        this.$element = $(element)
        this.options = options
        this.init()
    }

    FancyBoxPreview.prototype = {

        init: function () {
            this._fading = this.options.fading
            this._index = this.options.selected
            this.cacheImage = document.createElement('img')

            this.$element.css('cursor','pointer')

            $(this.options.thumbsSel + ' a').fancybox({
                'beforeLoad': fancyboxOpenHandler(this),
                'hideOnContentClick': true
            })

            $(this.options.thumbsSel + ' a img').on('click', {'that': this}, galleryClickHandler)

            this.selectItem(this.options.selected)

            return this
        }

        , selectItem: function (index) {
            $(this.options.thumbsSel + ' li:not('+index+')').removeClass(this.options.activeCls)
            $(this.options.thumbsSel + ' li:eq('+index+')').addClass(this.options.activeCls)

            var $a = $(this.options.thumbsSel + ' li:eq('+index+') a')
                , imgUrl = $a.attr('preview')

            if (this._fading) {
                this.cacheImage.src = imgUrl
                this.$element.fadeOut('slow', imgFadeOutHandler(this, imgUrl))
            }
            else
                this.$element.attr('src', imgUrl)

            this.$element.off('click')
            this.$element.on('click', function(e) {
                $a.trigger('click')
            })
        }
    }

    /* FANCYBOXPREVEW PRIVATE METHODS
     * ===================== */

    function galleryClickHandler(e) {
        var that = e.data.that
            , $target = $(e.target)
            , $a = $target.parent('a')
            , index = $a.parent().index()

        if (that.options.fading) that._fading = true

        if (index != that._index) {
            that.selectItem(index)
            that._index = index
        }
        else
            $a.trigger('click')

        e.preventDefault()
        e.stopPropagation()
        return false
    }


    function fancyboxOpenHandler(that) {
        return function(){
            that._fading = false
            that.selectItem(this.index)
            that._index = this.index
        }
    }

    function imgFadeOutHandler(that, imgUrl) {
        return function(){
            that.$element.attr('src', imgUrl)
            that.$element.fadeIn('fast')
        }
    }


    /* FANCYBOXPREVEW PLUGIN DEFINITION
     * ========================== */

    $.fn.fancyBoxPreview = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('fancyBoxPreview')
                , options = $.extend({}, $.fn.fancyBoxPreview.defaults, typeof option == 'object' && option)
            if (!data) $this.data('fancyBoxPreview', (data = new FancyBoxPreview(this, options)))
        })
    }

    $.fn.fancyBoxPreview.defaults = {
        thumbsSel: '.thumbs'
        , activeCls: 'thumb-active'
        , selected: 0
        , fading: true
    }

    $.fn.fancyBoxPreview.Constructor = FancyBoxPreview

    /* Note: an element to assign plugin on must be <img> */

    /* FANCYBOXPREVEW DATA-API
     * ================= */

    $(function () {
        $('[data-fancy]').each(function () {
            var $this = $(this)
                , thumbsSel = $this.attr('data-fancy')
                , activeCls = ($this.attr('data-active')) ? $this.attr('data-active') : false
                , options = {}

            if (thumbsSel) options.thumbsSel = thumbsSel
            if (activeCls) options.activeCls = activeCls

            if (options != {}) $this.fancyBoxPreview(options)
            else $this.fancyBoxPreview()
        })
    })

}(window.jQuery);