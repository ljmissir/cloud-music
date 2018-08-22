(function () {
    var _this = this
    _this.width = 640
    _this.fontSize = 20
    _this.widthProportion = function () {
        var p = ((document.body && document.body.clientWidth) || document.getElementsByTagName('html')[0].offsetWidth) / _this.width
        return p > 1 ? 1 : p < 0.5 ? 0.5 : p
    }
    _this.changePage = function () {
        document.getElementsByTagName('html')[0].setAttribute('style', 'font-size:' + _this.widthProportion() * _this.fontSize + 'px !important')
    }
    _this.changePage()
    window.addEventListener('resize', function () {
        _this.changePage()
    }, false)
})()