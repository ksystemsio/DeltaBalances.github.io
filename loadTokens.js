// try to get updated token list from EtherDelta, ForkDelta and IDEX otherwise use own backup

var etherDeltaConfig = offlineTokens;
var stagingTokens = offlineStagingTokens;

// dont get live etherdelta tokens, as they haven't been changed in >3 months
/*
try {
		$.getJSON('https://etherdelta.github.io/config/main.json', function(jsonData) {
			if(jsonData && jsonData.tokens) {
				etherDeltaConfig = jsonData;
			}
		});
	} catch (err){} 
try {
		$.getJSON('https://etherdelta.github.io/config/staging.json', function(jsonData) {
			if(jsonData && jsonData.tokens) {
				stagingTokens = jsonData;
			}
		});
	} catch (err) {} 
*/


var forkDeltaConfig = forkOfflineTokens;
try {

    let forkData = sessionStorage.getItem('forkTokens1');
    // only get live tokens if we haven't saved them this session already
    if (forkData !== null && forkData) {
        let parsed = JSON.parse(forkData);
        if (parsed && parsed.length > 0) {
            forkDeltaConfig.tokens = parsed;
        }
    } else {

        // if we have saved data from a previous session, pre-load it
        let forkData2 = localStorage.getItem('forkTokens2');
        if (forkData2 !== null && forkData2) {
            let parsed = JSON.parse(forkData2);
            if (parsed && parsed.length > forkDeltaConfig.length) {
                forkDeltaConfig.tokens = parsed;
            }
        }

        $.getJSON('https://forkdelta.github.io/config/main.json', function (jsonData) {
            if (jsonData && jsonData.tokens && jsonData.tokens.length > 0) {
                forkDeltaConfig = jsonData;
                let string = JSON.stringify(forkDeltaConfig.tokens);
                sessionStorage.setItem('forkTokens1', string);
                localStorage.setItem('forkTokens2', string);
            }
        });
    }
} catch (err) {
    console.log('forkdelta live tokens loading error ' + err);
}


var idexConfig = idexOfflineTokens;
try {
    let idexData = sessionStorage.getItem('idexTokens1');
    // only get live tokens if we haven't saved them this session already
    if (idexData !== null && idexData) {
        let parsed = JSON.parse(idexData);
        if (parsed && parsed.length > 0) {
            idexConfig = parsed;
        }
    } else {

        // if we have saved data from a previous session, pre-load it
        let idexData2 = localStorage.getItem('idexTokens2');
        if (idexData2 !== null && idexData2) {
            let parsed = JSON.parse(idexData2);
            if (parsed && parsed.length > idexConfig.length) {
                idexConfig = parsed;
            }
        }

        $.post("https://api.idex.market/returnCurrencies", function (data) {
            if (data) {
                let tokens = [];
                Object.keys(data).forEach(function (key) {
                    var token = data[key];
                    tokens.push({ name: key, decimals: token.decimals, addr: token.address.trim() });
                });
                if (tokens && tokens.length > 0) {
                    idexConfig = tokens;
                    let string = JSON.stringify(idexConfig)
                    sessionStorage.setItem('idexTokens1', string);
                    localStorage.setItem('idexTokens2', string);
                }
            }
        });
    }
} catch (err) {
    console.log('IDEX live tokens loading error ' + err);
}

var ddexConfig = ddexOfflineTokens;
try {

    let ddexData = sessionStorage.getItem('ddexTokens1');
    // only get live tokens if we haven't saved them this session already
    if (ddexData !== null && ddexData) {
        let parsed = JSON.parse(ddexData);
        if (parsed && parsed.length > 0) {
            ddexConfig.tokens = parsed;
        }
    } else {

        // if we have saved data from a previous session, pre-load it
        let ddexData2 = localStorage.getItem('ddexTokens2');
        if (ddexData2 !== null && ddexData2) {
            let parsed = JSON.parse(ddexData2);
            if (parsed && parsed.length > ddexConfig.length) {
                ddexConfig.tokens = parsed;
            }
        }

        $.getJSON('https://api.ddex.io/v2/tokens', function (jsonData) {
            if (jsonData && jsonData.data && jsonData.data.tokens && jsonData.data.tokens.length > 0) {
                ddexConfig = jsonData.data;
                ddexConfig.tokens.map((x) => { delete x.id; delete x.name;});
                let string = JSON.stringify(ddexConfig.tokens);
                sessionStorage.setItem('ddexTokens1', string);
                localStorage.setItem('ddexTokens2', string);
            }
        });
    }
} catch (err) {
    console.log('ddex live tokens loading error ' + err);
}