function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function _decimal(val, afterPoint) {
    if (afterPoint > 0) {
        return parseFloat(val).toFixed(afterPoint);
    }
    return parseFloat(val);
}

function newCrashPoint() {
    Number2 = getRandomIntInclusive(1, 1000000000);
    CrashPoint = 999999999 / _decimal(Number2);
    return CrashPoint;
}

var Game = {
    client: null,

    timeout: null,
    lastBet: null,

    multiplier: 1,

    bet: null,

    balance: 100,

    timestamp: null,

    timer: function () {
        this.lastBet = newCrashPoint();
        this.timestamp = new Date().getTime();
        this.timeout = setInterval(function(){
            this.multiplier += 0.01;

            this.client.emit('action:update', {
                multiplier: this.multiplier,
                timePassed: new Date().getTime() - this.timestamp
            });

            if (this.multiplier >= this.lastBet) {
                clearInterval(this.timeout);

                this.balance -= this.bet;

                this.client.emit('action:finished', {
                    lastBet: this.lastBet,
                    balance: _decimal(this.balance, 2)
                });

                console.log('Game finished');
            }
        }.bind(this), 10);
    },

    start: function (client, data) {
        this.client = client;
        this.multiplier = 1;
        this.bet = parseFloat(data.amount);

        if (this.checkBalance())
            this.timer();
        else
            this.client.emit('action:lowBalance', {
                lastBet: this.lastBet,
                balance: _decimal(this.balance, 2)
            });
    },

    checkBalance: function() {
        if (this.balance >= this.bet) return true;
    },

    cashout: function () {
        clearTimeout(this.timeout);
        this.balance += this.bet * this.multiplier;

        this.client.emit('action:cashout', {
            lastBet: this.lastBet,
            balance: _decimal(this.balance, 2)
        });
    }
}


module.exports = Game;