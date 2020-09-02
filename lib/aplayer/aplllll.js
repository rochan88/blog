'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor)
                descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
            defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();
var _promisePolyfill = require('promise-polyfill');
var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);
var _utils = require('./utils');
var _utils2 = _interopRequireDefault(_utils);
var _icons = require('./icons');
var _icons2 = _interopRequireDefault(_icons);
var _options = require('./options');
var _options2 = _interopRequireDefault(_options);
var _template = require('./template');
var _template2 = _interopRequireDefault(_template);
var _bar = require('./bar');
var _bar2 = _interopRequireDefault(_bar);
var _storage = require('./storage');
var _storage2 = _interopRequireDefault(_storage);
var _lrc = require('./lrc');
var _lrc2 = _interopRequireDefault(_lrc);
var _controller = require('./controller');
var _controller2 = _interopRequireDefault(_controller);
var _timer = require('./timer');
var _timer2 = _interopRequireDefault(_timer);
var _events = require('./events');
var _events2 = _interopRequireDefault(_events);
var _list = require('./list');
var _list2 = _interopRequireDefault(_list);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var instances = [];
var APlayer = function () {
    function APlayer(options) {
        _classCallCheck(this, APlayer);
        this.options = (0, _options2.default)(options);
        this.container = this.options.container;
        this.paused = true;
        this.playedPromise = _promisePolyfill2.default.resolve();
        this.mode = 'normal';
        this.randomOrder = _utils2.default.randomOrder(this.options.audio.length);
        this.container.classList.add('aplayer');
        if (this.options.lrcType && !this.options.fixed) {
            this.container.classList.add('aplayer-withlrc');
        }
        if (this.options.audio.length > 1) {
            this.container.classList.add('aplayer-withlist');
        }
        if (_utils2.default.isMobile) {
            this.container.classList.add('aplayer-mobile');
        }
        this.arrow = this.container.offsetWidth <= 300;
        if (this.arrow) {
            this.container.classList.add('aplayer-arrow');
        }
        this.container = this.options.container;
        if (this.options.lrcType === 2 || this.options.lrcType === true) {
            var lrcEle = this.container.getElementsByClassName('aplayer-lrc-content');
            for (var i = 0; i < lrcEle.length; i++) {
                if (this.options.audio[i]) {
                    this.options.audio[i].lrc = lrcEle[i].innerHTML;
                }
            }
        }
        this.template = new _template2.default({
            container: this.container,
            options: this.options,
            randomOrder: this.randomOrder
        });
        if (this.options.fixed) {
            this.container.classList.add('aplayer-fixed');
            this.template.body.style.width = this.template.body.offsetWidth - 18 + 'px';
        }
        if (this.options.mini) {
            this.setMode('mini');
            this.template.info.style.display = 'block';
        }
        if (this.template.info.offsetWidth < 200) {
            this.template.time.classList.add('aplayer-time-narrow');
        }
        if (this.options.lrcType) {
            this.lrc = new _lrc2.default({
                container: this.template.lrc,
                async: this.options.lrcType === 3,
                player: this
            });
        }
        this.events = new _events2.default();
        this.storage = new _storage2.default(this);
        this.bar = new _bar2.default(this.template);
        this.controller = new _controller2.default(this);
        this.timer = new _timer2.default(this);
        this.list = new _list2.default(this);
        this.initAudio();
        this.bindEvents();
        if (this.options.order === 'random') {
            this.list.switch(this.randomOrder[0]);
        } else {
            this.list.switch(0);
        }
        if (this.options.autoplay) {
            this.play();
        }
        instances.push(this);
    }
    _createClass(APlayer, [
        {
            key: 'initAudio',
            value: function initAudio() {
                var _this = this;
                this.audio = document.createElement('audio');
                this.audio.preload = this.options.preload;
                var _loop = function _loop(i) {
                    _this.audio.addEventListener(_this.events.audioEvents[i], function (e) {
                        _this.events.trigger(_this.events.audioEvents[i], e);
                    });
                };
                for (var i = 0; i < this.events.audioEvents.length; i++) {
                    _loop(i);
                }
                this.volume(this.storage.get('volume'), true);
            }
        },
        {
            key: 'bindEvents',
            value: function bindEvents() {
                var _this2 = this;
                this.on('play', function () {
                    if (_this2.paused) {
                        _this2.setUIPlaying();
                    }
                });
                this.on('pause', function () {
                    if (!_this2.paused) {
                        _this2.setUIPaused();
                    }
                });
                this.on('timeupdate', function () {
                    if (!_this2.disableTimeupdate) {
                        _this2.bar.set('played', _this2.audio.currentTime / _this2.duration, 'width');
                        _this2.lrc && _this2.lrc.update();
                        var currentTime = _utils2.default.secondToTime(_this2.audio.currentTime);
                        if (_this2.template.ptime.innerHTML !== currentTime) {
                            _this2.template.ptime.innerHTML = currentTime;
                        }
                    }
                });
                this.on('durationchange', function () {
                    if (_this2.duration !== 1) {
                        _this2.template.dtime.innerHTML = _utils2.default.secondToTime(_this2.duration);
                    }
                });
                this.on('progress', function () {
                    var percentage = _this2.audio.buffered.length ? _this2.audio.buffered.end(_this2.audio.buffered.length - 1) / _this2.duration : 0;
                    _this2.bar.set('loaded', percentage, 'width');
                });
                var skipTime = void 0;
                this.on('error', function () {
                    if (_this2.list.audios.length) {
                        _this2.notice('An audio error has occurred, player will skip forward in 2 seconds.');
                        skipTime = setTimeout(function () {
                            _this2.skipForward();
                            if (!_this2.paused) {
                                _this2.play();
                            }
                        }, 2000);
                    } else {
                        _this2.notice('An audio error has occurred.');
                    }
                });
                this.events.on('listswitch', function () {
                    skipTime && clearTimeout(skipTime);
                });
                this.on('ended', function () {
                    if (_this2.options.loop === 'none') {
                        if (_this2.options.order === 'list') {
                            if (_this2.list.index < _this2.list.audios.length - 1) {
                                _this2.list.switch((_this2.list.index + 1) % _this2.list.audios.length);
                                _this2.play();
                            } else {
                                _this2.list.switch((_this2.list.index + 1) % _this2.list.audios.length);
                                _this2.pause();
                            }
                        } else if (_this2.options.order === 'random') {
                            if (_this2.randomOrder.indexOf(_this2.list.index) < _this2.randomOrder.length - 1) {
                                _this2.list.switch(_this2.nextIndex());
                                _this2.play();
                            } else {
                                _this2.list.switch(_this2.nextIndex());
                                _this2.pause();
                            }
                        }
                    } else if (_this2.options.loop === 'one') {
                        _this2.list.switch(_this2.list.index);
                        _this2.play();
                    } else if (_this2.options.loop === 'all') {
                        _this2.skipForward();
                        _this2.play();
                    }
                });
            }
        },
        {
            key: 'setAudio',
            value: function setAudio(audio) {
                if (this.hls) {
                    this.hls.destroy();
                    this.hls = null;
                }
                var type = audio.type;
                if (this.options.customAudioType && this.options.customAudioType[type]) {
                    if (Object.prototype.toString.call(this.options.customAudioType[type]) === '[object Function]') {
                        this.options.customAudioType[type](this.audio, audio, this);
                    } else {
                        console.error('Illegal customType: ' + type);
                    }
                } else {
                    if (!type || type === 'auto') {
                        if (/m3u8(#|\?|$)/i.exec(audio.url)) {
                            type = 'hls';
                        } else {
                            type = 'normal';
                        }
                    }
                    if (type === 'hls') {
                        if (Hls.isSupported()) {
                            this.hls = new Hls();
                            this.hls.loadSource(audio.url);
                            this.hls.attachMedia(this.audio);
                        } else if (this.audio.canPlayType('application/x-mpegURL') || this.audio.canPlayType('application/vnd.apple.mpegURL')) {
                            this.audio.src = audio.url;
                        } else {
                            this.notice('Error: HLS is not supported.');
                        }
                    } else if (type === 'normal') {
                        this.audio.src = audio.url;
                    }
                }
                this.seek(0);
                if (!this.paused) {
                    this.audio.play();
                }
            }
        },
        {
            key: 'theme',
            value: function theme() {
                var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.list.audios[this.list.index].theme || this.options.theme;
                var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.list.index;
                var isReset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                if (isReset) {
                    this.list.audios[index] && (this.list.audios[index].theme = color);
                }
                this.template.listCurs[index] && (this.template.listCurs[index].style.backgroundColor = color);
                if (index === this.list.index) {
                    this.template.pic.style.backgroundColor = color;
                    this.template.played.style.background = color;
                    this.template.thumb.style.background = color;
                    this.template.volume.style.background = color;
                }
            }
        },
        {
            key: 'seek',
            value: function seek(time) {
                time = Math.max(time, 0);
                time = Math.min(time, this.duration);
                this.audio.currentTime = time;
                this.bar.set('played', time / this.duration, 'width');
                this.template.ptime.innerHTML = _utils2.default.secondToTime(time);
            }
        },
        {
            key: 'setUIPlaying',
            value: function setUIPlaying() {
                var _this3 = this;
                if (this.paused) {
                    this.paused = false;
                    this.template.button.classList.remove('aplayer-play');
                    this.template.button.classList.add('aplayer-pause');
                    this.template.button.innerHTML = '';
                    setTimeout(function () {
                        _this3.template.button.innerHTML = _icons2.default.pause;
                    }, 100);
                    this.template.skipPlayButton.innerHTML = _icons2.default.pause;
                }
                this.timer.enable('loading');
                if (this.options.mutex) {
                    for (var i = 0; i < instances.length; i++) {
                        if (this !== instances[i]) {
                            instances[i].pause();
                        }
                    }
                }
            }
        },
        {
            key: 'play',
            value: function play() {
                var _this4 = this;
                this.setUIPlaying();
                var playPromise = this.audio.play();
                if (playPromise) {
                    playPromise.catch(function (e) {
                        console.warn(e);
                        if (e.name === 'NotAllowedError') {
                            _this4.setUIPaused();
                        }
                    });
                }
            }
        },
        {
            key: 'setUIPaused',
            value: function setUIPaused() {
                var _this5 = this;
                if (!this.paused) {
                    this.paused = true;
                    this.template.button.classList.remove('aplayer-pause');
                    this.template.button.classList.add('aplayer-play');
                    this.template.button.innerHTML = '';
                    setTimeout(function () {
                        _this5.template.button.innerHTML = _icons2.default.play;
                    }, 100);
                    this.template.skipPlayButton.innerHTML = _icons2.default.play;
                }
                this.container.classList.remove('aplayer-loading');
                this.timer.disable('loading');
            }
        },
        {
            key: 'pause',
            value: function pause() {
                this.setUIPaused();
                this.audio.pause();
            }
        },
        {
            key: 'switchVolumeIcon',
            value: function switchVolumeIcon() {
                if (this.volume() >= 0.95) {
                    this.template.volumeButton.innerHTML = _icons2.default.volumeUp;
                } else if (this.volume() > 0) {
                    this.template.volumeButton.innerHTML = _icons2.default.volumeDown;
                } else {
                    this.template.volumeButton.innerHTML = _icons2.default.volumeOff;
                }
            }
        },
        {
            key: 'volume',
            value: function volume(percentage, nostorage) {
                percentage = parseFloat(percentage);
                if (!isNaN(percentage)) {
                    percentage = Math.max(percentage, 0);
                    percentage = Math.min(percentage, 1);
                    this.bar.set('volume', percentage, 'height');
                    if (!nostorage) {
                        this.storage.set('volume', percentage);
                    }
                    this.audio.volume = percentage;
                    if (this.audio.muted) {
                        this.audio.muted = false;
                    }
                    this.switchVolumeIcon();
                }
                return this.audio.muted ? 0 : this.audio.volume;
            }
        },
        {
            key: 'on',
            value: function on(name, callback) {
                this.events.on(name, callback);
            }
        },
        {
            key: 'toggle',
            value: function toggle() {
                if (this.template.button.classList.contains('aplayer-play')) {
                    this.play();
                } else if (this.template.button.classList.contains('aplayer-pause')) {
                    this.pause();
                }
            }
        },
        {
            key: 'switchAudio',
            value: function switchAudio(index) {
                this.list.switch(index);
            }
        },
        {
            key: 'addAudio',
            value: function addAudio(audios) {
                this.list.add(audios);
            }
        },
        {
            key: 'removeAudio',
            value: function removeAudio(index) {
                this.list.remove(index);
            }
        },
        {
            key: 'destroy',
            value: function destroy() {
                instances.splice(instances.indexOf(this), 1);
                this.pause();
                this.container.innerHTML = '';
                this.audio.src = '';
                this.timer.destroy();
                this.events.trigger('destroy');
            }
        },
        {
            key: 'setMode',
            value: function setMode() {
                var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';
                this.mode = mode;
                if (mode === 'mini') {
                    this.container.classList.add('aplayer-narrow');
                } else if (mode === 'normal') {
                    this.container.classList.remove('aplayer-narrow');
                }
            }
        },
        {
            key: 'notice',
            value: function notice(text) {
                var _this6 = this;
                var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
                var opacity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;
                this.template.notice.innerHTML = text;
                this.template.notice.style.opacity = opacity;
                if (this.noticeTime) {
                    clearTimeout(this.noticeTime);
                }
                this.events.trigger('noticeshow', { text: text });
                if (time) {
                    this.noticeTime = setTimeout(function () {
                        _this6.template.notice.style.opacity = 0;
                        _this6.events.trigger('noticehide');
                    }, time);
                }
            }
        },
        {
            key: 'prevIndex',
            value: function prevIndex() {
                if (this.list.audios.length > 1) {
                    if (this.options.order === 'list') {
                        return this.list.index - 1 < 0 ? this.list.audios.length - 1 : this.list.index - 1;
                    } else if (this.options.order === 'random') {
                        var index = this.randomOrder.indexOf(this.list.index);
                        if (index === 0) {
                            return this.randomOrder[this.randomOrder.length - 1];
                        } else {
                            return this.randomOrder[index - 1];
                        }
                    }
                } else {
                    return 0;
                }
            }
        },
        {
            key: 'nextIndex',
            value: function nextIndex() {
                if (this.list.audios.length > 1) {
                    if (this.options.order === 'list') {
                        return (this.list.index + 1) % this.list.audios.length;
                    } else if (this.options.order === 'random') {
                        var index = this.randomOrder.indexOf(this.list.index);
                        if (index === this.randomOrder.length - 1) {
                            return this.randomOrder[0];
                        } else {
                            return this.randomOrder[index + 1];
                        }
                    }
                } else {
                    return 0;
                }
            }
        },
        {
            key: 'skipBack',
            value: function skipBack() {
                this.list.switch(this.prevIndex());
            }
        },
        {
            key: 'skipForward',
            value: function skipForward() {
                this.list.switch(this.nextIndex());
            }
        },
        {
            key: 'duration',
            get: function get() {
                return isNaN(this.audio.duration) ? 0 : this.audio.duration;
            }
        }
    ], [{
            key: 'version',
            get: function get() {
                return APLAYER_VERSION;
            }
        }]);
    return APlayer;
}();
exports.default = APlayer;