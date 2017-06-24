/*

Modulo per interfacciamento PayER

*/

var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV   = require('../tmp/config.js'); // load configuration data
var fs = require('fs');
var log = require('./loggerModule.js');
var crypto = require('crypto');

log.log2console('Starting ...');

var _encryptIV  = '';
var _encryptKey = '';
var _codicePortale = '';


function addZero(x,n) {
      while (x.toString().length < n) {
        x = "0" + x;
      }
    return x;
}

module.exports = {

initPayER: function(encryptIV, encryptKey, codicePortale) {
		this._encryptIV = encryptIV;
		this._encryptKey = encryptKey;
		this._codicePortale = codicePortale;    
},

getTagOrario : function(){ 
    var gTO = moment().format('YYYYMMDDHHmm'); 
    console.log('getTagOrario:', gTO); 
    return gTO;  
},

getMD5Hash: function(data) { 
    var cHash = crypto.createHash('md5').update(data).digest("hex");
    //var cHash2 = crypto.createHash('md5').update(data).digest('binary');
    console.log(cHash);
    //console.log(cHash2);
    // md5 = new Buffer(md5, "binary").toString('base64');
    // const buf = Buffer.from(cHash, 'ascii');

    // Prints: 68656c6c6f20776f726c64
    //console.log(buf.toString('hex'));
    //console.log('getMD5Hash:', cHash); 
    return cHash;
},

getBufferPaymentRequest: function(bufferDati) { 
    var bR = this.creaBuffer(bufferDati, this._encryptIV, this._encryptKey, this._codicePortale);
    console.log('getBufferPaymentRequest'); 
    console.log(bR);
    return bR;
},
getBufferRID: function(rID) { 
    console.log('getBufferRID'); 
    var bR = this.creaBuffer(rID, this._encryptIV, this._encryptKey, this._codicePortale);
    console.log(bR);
    return bR;
},

getBufferPID: function(pID) { 
    console.log('getBufferPID'); 
    var bR = this.creaBuffer(pID, this._encryptIV, this._encryptKey, this._codicePortale);
    console.log(bR);
    return bR;    
},

getPaymentData: function(buffer, window_minutes) { console.log('getMD5Hash'); },

creaBuffer: function(bufferDati, encryptIV, encryptKey, codicePortale)	{

        console.log('creaBuffer',bufferDati, encryptIV, encryptKey, codicePortale);
		var buffer = '';
		var sTagOrario = this.getTagOrario();
		var hash = this.getMD5Hash(encryptIV + bufferDati + encryptKey + sTagOrario);
		//var bufferDatiCrypt = Base64.encode(bufferDati.getBytes()); //URLEncoder.encode(cryptoService.encryptBASE64(bufferDati), "UTF-8");
        var bufferDatiCrypt = new Buffer(bufferDati).toString('base64');
			
			/*cryptoService.destroy();
			cryptoService = null;*/
			
		var	buffer = "<Buffer>" +
	        	"<TagOrario>" + sTagOrario + "</TagOrario>" + 
	        	"<CodicePortale>" + codicePortale + "</CodicePortale>" +
	        	"<BufferDati>" + bufferDatiCrypt + "</BufferDati>" + 
	        	"<Hash>" + hash + "</Hash>" +
	    	"</Buffer>";
			
        //log.log2console(buffer);
        return buffer;
},
	
/*

	protected String decodeBuffer(String buffer, int window_minutes, String encryptIV, String encryptKey, Logger logger) throws SedaExtException
	{
		try
		{
			//verifica dati buffer
	        Document doc = Utilities.getXmlDocumentFromString(buffer);
	        String sTagOrario = Utilities.getElementValue("/Buffer/TagOrario", doc);
	        String sBufferDatiCrypt = Utilities.getElementValue("/Buffer/BufferDati", doc);
	        String sHashRicevuto = Utilities.getElementValue("/Buffer/Hash", doc);
	        
	        if (sTagOrario.equals(""))
				throw new SedaExtException(Messages.ERROR_XML_NODE.format("TagOrario"));
			if (sBufferDatiCrypt.equals(""))
				throw new SedaExtException(Messages.ERROR_XML_NODE.format("BufferDati"));
			if (sHashRicevuto.equals(""))
				throw new SedaExtException(Messages.ERROR_XML_NODE.format("Hash"));
			
			//verifica finestra temporale
	        verificaFinestraTemporale(sTagOrario, window_minutes);
	        logger.info(Messages.TIME_WINDOW_VERIFIED.format());
	        
	        //decodifica buffer Base64
	        String bufferDati = decodificaBuffer(sBufferDatiCrypt);
	        
	        //verifica hash
	        verificaHash(sHashRicevuto, bufferDati, encryptIV, encryptKey, sTagOrario);
	        logger.info(Messages.HASH_VERIFIED.format());
	       	        
	        logger.info(Messages.DATA_BUFFER.format(bufferDati));
	        return bufferDati;
	        
		}  catch (ParserConfigurationException e) {
			e.printStackTrace();
			throw new SedaExtException(Messages.XML_EXCEPTION.format(), e);
		} catch (SAXException e) {
			e.printStackTrace();
			throw new SedaExtException(Messages.XML_EXCEPTION.format(), e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new SedaExtException(Messages.XML_EXCEPTION.format(), e);
		}
	}
	
	private void verificaFinestraTemporale(String sTagOrario, int window_minutes) throws SedaExtException
	{
	    long longTagOrario = 0L;
	    try
	    {
	        Calendar calReceived = Calendar.getInstance();
	        String sAnno = sTagOrario.substring(0, 4);
	        String sMese = sTagOrario.substring(4, 6);
	        String sGiorno = sTagOrario.substring(6, 8);
	        String sOra = sTagOrario.substring(8, 10);
	        String sMinuti = sTagOrario.substring(10, 12);
	        
	        calReceived.set(Calendar.YEAR, Integer.parseInt(sAnno));
	        calReceived.set(Calendar.MONTH, Integer.parseInt(sMese) - 1);
	        calReceived.set(Calendar.DATE, Integer.parseInt(sGiorno));
	        calReceived.set(Calendar.HOUR_OF_DAY, Integer.parseInt(sOra));
	        calReceived.set(Calendar.MINUTE, Integer.parseInt(sMinuti));
	        
	        longTagOrario = calReceived.getTimeInMillis(); 
	    }
	    catch(Exception e)
	    {
	    	e.printStackTrace();
	    	throw new SedaExtException(Messages.INVALID_PARAMETER_VALUE.format("TagOrario"), e);
	    }
	    
	    Calendar calNow = Calendar.getInstance();
	
	    long longActualDate = calNow.getTimeInMillis(); 
	    long lMinutiDiff = Math.abs((longActualDate - longTagOrario) / (long)60000);
	    
	    if(lMinutiDiff > (long)window_minutes)
	    {
	    	throw new SedaExtException(Messages.TIME_WINDOW_EXPIRED.format());
	    }
	}
	
	private String decodificaBuffer(String sBufferDatiCrypt) 
	{
	    String bufferDati = new String(Base64.decode(sBufferDatiCrypt)); 
	    return bufferDati;
	}
	
	private void verificaHash(String sHashRicevuto, String bufferDati, String encryptIV, String encryptKey, String sTagOrario) throws SedaExtException
	{
		String hashCalcolato = null;
		try {
			hashCalcolato = Utilities.getMD5Hash(encryptIV + bufferDati + encryptKey + sTagOrario);
			
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			throw new SedaExtException(Messages.HASH_CREATION_ERROR.format(), e);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			throw new SedaExtException(Messages.HASH_CREATION_ERROR.format(), e);
		}
	    if(hashCalcolato == null || hashCalcolato.equals(""))
	    	throw new SedaExtException(Messages.HASH_CREATION_ERROR.format());

	    if(!hashCalcolato.equalsIgnoreCase(sHashRicevuto))
	    	throw new SedaExtException(Messages.HASH_CREATION_ERROR.format(sHashRicevuto, hashCalcolato));
	}

*/


test : function(){ console.log('test'); },

pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
},

uint8ArrayToBase64Url : function(uint8Array, start, end) {
    start = start || 0;
    end = end || uint8Array.byteLength;

  const base64 = window.btoa(
    String.fromCharCode.apply(null, uint8Array.subarray(start, end)));
  return base64
    .replace(/\=/g, '') // eslint-disable-line no-useless-escape
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
},

// Converts the URL-safe base64 encoded |base64UrlData| to an Uint8Array buffer.
base64UrlToUint8Array : function(base64UrlData) {
    const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
    const base64 = (base64UrlData + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const buffer = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        buffer[i] = rawData.charCodeAt(i);
    }
    return buffer;
    },

base64_encode: function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
},

base64_decode: function (base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
},

ensureAuthenticated : function(req, res, next) {

        //"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiY29tcGFueU5hbWUiOiJDb211bmVfZGlfUmltaW5pIiwiYXBwIjoicHJvdG9jb2xsbyJ9LCJpYXQiOjE0Nzk5OTkwMzQsImV4cCI6MTU2NjM5NTQzNH0.5Ako1xZ9If5bNrKN3ns8sZ8YaqaJD7FWDt07zcRb8c0"

        console.log('[#AUTH#] ensureAuthenticated (start)');
        if (!req.header('Authorization')) {
            console.log('[#AUTH#] ensureAuthenticated : 401 NO TOKEN');
            return res.status(401).send({ message: 'Effettuare login prima di procedere (401 NO TOKEN)' });
        }
          var token = req.header('Authorization').split(' ')[1];
         
          // console.log(req.header('Authorization'));
          var payload = null;
          try {
            payload = jwt.decode(token, ENV.secret);
          }
          catch (err) {
            console.log('[#AUTH#] ensureAuthenticated decoded error');
            console.log(err);
            return res.status(401).send({ message: err.message });
          }

          // console.log(payload);

          if(payload){
            if (payload.exp) {
              if (payload.exp <= moment().unix()) {
                console.log('[#AUTH#] token expired');
                return res.status(401).send({ 
                  title: 'Sessione scaduta',
                  message: 'Accedere alla pagina di login, disconnettersi poi rifare la procedura di autenticazione'
                });
              }
            } else {
              var msg = '[#AUTH#] ensureAuthenticated decoded error - exp NOT FOUND';
              console.log(msg);
              return res.status(401).send({ message: msg });
            }
          } else {
            var msg = '[#AUTH#] ensureAuthenticated decoded error - payload NOT FOUND';
            console.log(msg);
            return res.status(401).send({ message: msg });
          }

          console.log('[#AUTH#] ok pass');
          req.user = payload.sub;
          next();
    },
    
    createJWT: function(user, timeout1, timeout2) {
          // moment.js syntax 
          timeout1 = timeout1 || 2;
          timeout2 = timeout2 || 'h';
          var payload = {
            sub: user,
            iat: moment().unix(),
            // timeout di 2 ore
            exp: moment().add(timeout1, timeout2).unix()
          };
          return jwt.sign(payload, ENV.secret);
    },

    decodeJWT: function(token) {
        //console.log(token);
          var payload = null;
          try {
            payload = jwt.decode(token, ENV.secret);
            if (payload.exp <= moment().unix()) {
              console.log('token expired');
            }
            return payload;
          }
          catch (err) {
            console.log('ensureAuthenticated decoded error');
            console.log(err);
            return {};
          }

          console.log(payload);
    },


    getNowFormatted: function(strTime2Add) {

          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          console.log('UtilsService:getNowFormatted');


          var suffix = Math.floor(Math.random()*90000) + 10000;

            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          console.log(time.join(""));  

          var timeFormatted = [year, month, day].join('-');
          if (strTime2Add) {
            timeFormatted = timeFormatted + strTime2Add;
          } 

          // Return the formatted string
          return timeFormatted;
          //return date.join("") + "@" + time.join("") + "@" + suffix;

    },


    getTimestampPlusRandom: function() {

          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          console.log('UtilsService');
          console.log(time);

          var suffix = Math.floor(Math.random()*90000) + 10000;

            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          

          console.log(time.join(""));  

          // Return the formatted string
          return [year, month, day].join('') + "@" + time.join("") + "@" + ms + "@" + suffix;
          //return date.join("") + "@" + time.join("") + "@" + suffix;
        }
}


