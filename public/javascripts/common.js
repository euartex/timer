jQuery(document).ready(function () {
    var socket = io.connect('http://192.168.88.31:3000');

    var form = jQuery('#place-bet-form');
    if( form.data('status') === undefined)
        form.data('status', false);

    jQuery('#place-bet-form').on('submit', function (e) {
        e.preventDefault();

        form.data('status', !form.data('status'));

        if(form.data('status')) {
            console.log('start');
            jQuery('#multiplier').text('1.00x');

            jQuery('#place-bet-form input[type=submit]').val('Cash Out');

            socket.emit('action:placeBet', {
                'amount': jQuery('input[name="amount"]').val(),
                'autoCashOut': jQuery('input[name="autoCashOut"]').val()
            });
        }
        else {
            console.log('finish');
            jQuery('#place-bet-form input[type=submit]').val('Place Bet');

            socket.emit('action:cashout', {});
        }

        return false;
    });

    function updateData(data){
        jQuery('.text-success').text(data.balance + '$');
        jQuery('#last_bets').val(jQuery('#last_bets').val() + 'Value crashed at: '  + data.lastBet + '\n');
        jQuery('#place-bet-form input[type=submit]').val('Place Bet');
        form.data('status', false);
    }

    socket.on('action:update', function(data) {
        jQuery('#multiplier').text(parseFloat(data.multiplier).toFixed(2)+'x');
    });

    socket.on('action:finished', function(data) {
        console.log('Finished');
        updateData(data);
    });

    socket.on('action:cashout', function(data){
        console.log('Cashout');
        updateData(data);
    });

    socket.on('action:lowBalance', function(data){
        console.log('Low balance');
        jQuery('#place-bet-form input[type=submit]').val('Place Bet');
        form.data('status', false);
        alert('You have low balance to make this bet');
    });

});