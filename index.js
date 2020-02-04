const EventEmitter = require('events')
const fs = require('fs');
class Tail extends EventEmitter {

    constructor({ filename }) {
        super()
        this.filename = filename
        this.lastByte = 0;
        this.data = '';
        // let the user register the handler
        setImmediate(this.init.bind(this))
    }

    init() {

        try {
            let { size } = fs.statSync(this.filename)
            this.lastByte = size;
        } catch (err) {
            this.emit('error', err);

        }

        fs.watch(this.filename, { encoding: 'utf8' }, this.onWatch.bind(this));

    }

    onWatch(type) {
        if (type === 'change' || type === 'rename') {
            this.onFileChange();
        }
    }

    onFileChange() {
        fs.stat(this.filename, (err, { size: _currentByte }) => {
            if (err) {
                this.emit('error', err);
            }
            if (_currentByte > this.lastByte) {
                let streamIn = fs.createReadStream(this.filename, { start: this.lastByte, encoding: 'utf8' });
                streamIn.on('data', (_currentData) => {
                    this.data = this.data + _currentData;
                    this.lastByte = _currentByte;
                })
                streamIn.on('end', () => {
                    let regex = /\r?\n|\r/g
                    if (regex.exec(this.data)) {
                        this.data = this.data.replace(regex, "")
                        this.emit('line', this.data)
                        this.data = '';
                    }

                })

            } else {
                // few content was removed from file
                // so resetting it to last
                this.lastByte = _currentByte;

            }

        })

    }
}

module.exports = Tail;
module.exports.Tail = Tail;