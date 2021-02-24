#!/usr/bin/env node

var pcsc = require('../index');

var pcsc = pcsc();
console.log("inside checkCardPin");


pcsc.on('reader', function(reader) {
    console.log('New reader detected', reader.name);
    reader.on('error', function(err) {
        console.log('Error(', this.name, '):', err.message);
    });
    reader.on('status', function(status) {
        console.log('Status(', this.name, '):', status);
        /* check what has changed */
        var changes = this.state ^ status.state;
        if (changes) {
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                console.log("card removed"); /* card removed */
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Disconnected');
                    }
                });
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                console.log("card inserted"); /* card inserted */
                reader.connect({ share_mode: this.SCARD_SHARE_SHARED }, function(err, protocol) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Protocol(', reader.name, '):', protocol);

                        // reader.transmit(Buffer.from([0x00, 0x20, 0x00, 0x80]), 255, protocol, function(err, data) {
                        //     if (err) {
                        //         console.log("In PIV get retries " + err);

                        //     } else {
                        //         console.log("retries");
                        //         console.log(data[0].toString(16));
                        //         console.log(data[1].toString(16));
                        //         //reader.close();
                        //         //pcsc.close();
                        //     }
                        // });

                        // reader.transmit(Buffer.from([0x00, 0x20, 0x00, 0x80, 0x08, pinHexArray[0], pinHexArray[1], pinHexArray[2], pinHexArray[3], pinHexArray[4], pinHexArray[5], 0xFF, 0xFF]), 255, protocol, function(err, data) {
                        //     if (err) {
                        //         console.log("In PIV Verify " + err);

                        //     } else {
                        //         console.log("verify pin");
                        //         console.log(data[0].toString(16));
                        //         console.log(data[1].toString(16));
                        //         //reader.close();
                        //         //pcsc.close();
                        //     }
                        //     // if 63 + CX, fail and x=retries left
                        //     // if 63 + 00, fail
                        //     // if 90 + 00, success
                        // });

                        reader.transmit(Buffer.from([0x00, 0xCB, 0x3F, 0xFF, 0x05, 0x5C, 0x03, 0x5F, 0xC1, 0x0A]), 255, protocol, function(err, data) {
                            if (err) {
                                console.log("In Get Data Signing cert" + err);

                            } else {
                                console.log("Get Data signing cert");
                                console.log(data[0].toString(16));
                                console.log(data[1].toString(16));

                                reader.transmit(Buffer.from([0x00, 0xC0, 0x00, 0x00, 0x00]), 258, protocol, function(err, data) {
                                    if (err) {
                                        console.log("In something " + err);

                                    } else {
                                        console.log("get response data");
                                        console.log(data);
                                        console.log(data[0].toString(16));
                                        console.log(data[1].toString(16));
                                        //reader.close();
                                        //pcsc.close();
                                    }
                                    // if 63 + CX, fail and x=retries left
                                    // if 63 + 00, fail
                                    // if 90 + 00, success
                                });
                                //reader.close();
                                //pcsc.close();
                            }
                            // if 63 + CX, fail and x=retries left
                            // if 63 + 00, fail
                            // if 90 + 00, success
                        });


                        // reader.transmit(Buffer.from([0x00, 0xCB, 0x3F, 0xFF, 0x05, 0x5C, 0x03, 0x5F, 0xC1, 0x09]), 255, protocol, function(err, data) {
                        //     if (err) {
                        //         console.log("In Get printed " + err);

                        //     } else {
                        //         console.log("Get printed");
                        //         console.log(data[0].toString(16));
                        //         console.log(data[1].toString(16));
                        //         console.dir(data);
                        //         reader.transmit(Buffer.from([0x00, 0xC0, 0x00, 0x00, 0x00]), 258, protocol, function(err, data) {
                        //             if (err) {
                        //                 console.log("In something " + err);

                        //             } else {
                        //                 console.log("get response data");
                        //                 console.log(data);
                        //                 console.log(data[0].toString(16));
                        //                 console.log(data[1].toString(16));
                        //                 //reader.close();
                        //                 //pcsc.close();
                        //             }
                        //             // if 63 + CX, fail and x=retries left
                        //             // if 63 + 00, fail
                        //             // if 90 + 00, success
                        //         });
                        //         //reader.close();
                        //         //pcsc.close();
                        //     }
                        //     // if 63 + CX, fail and x=retries left
                        //     // if 63 + 00, fail
                        //     // if 90 + 00, success
                        // });


                    }
                });
            }
        }
    });
    reader.on('end', function() {
        console.log('Reader', this.name, 'removed');
    });
});
pcsc.on('error', function(err) {
    console.log('PCSC error', err.message);
})
reader.close();
pcsc.close();
}