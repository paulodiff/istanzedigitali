# Istanze Digitali
## Un framework per far diventare digitali i procedimenti amministrativi che non ci riescono


E' un framework/progetto che permette di gestire la ricezione e lo stato delle istanze di procedimento in maniera digitale.

### Le principali caratteristiche sono:

-	Integrazione con FEDERA/SPID
-	Integrazione con il software di Gestione Documentale
-	Interfacce che seguono le specifiche di design.italia.it
-	Notifiche al cittadino dello stato dell'istanza
-	Interfaccia di accoglimento istanze facilmente personalizzabile
-   Interfacciamento dei flussi dati con i gestionali dell'ufficio
-	Open Source

## Descrizinoe

Nella pubblica amministrazione molti procedimenti interni sono gestiti attraverso piccoli gestionali, 
fogli di calcolo o file e cartelle. Per questo tipo di procedimenti risulta molto difficile e dispendioso
poter disporre di una interfaccia web per raccogliere le istanze in

Le principali caratteristiche sono:

## Il caso d'uso tipico

Richiesta di prenotazione e rinnovo di una tipologia di autorizzazione.

    1) Si prepara il form dati per la richiesta dati con la possibilitò di allegare dei documenti
    2) Si comunica il link sul sito web dell'ente (il link sarà attivo per tutta la durata del rinnovo)
    3) I cittadini richiedenti si autenticano con SPID compilano i dati ed inviano l'istanza
    4) L'istanza viene protocollata, inoltrata all'ufficio competente
    5) Al cittadino viene inviata una informativa di avvio procedimento con il protocollo e tutte le informazioni necessarie
    6) I dati inviati vengono raccolti nella modalità più comoda per la gestione 
    7) Al cittadino vengono inviate le notifiche sullo stato di avanzamento del procedimento
    

Scadenza  l'ufficio gestisce i dati su excel il protocollo

Tecnologie

- Le Tecnologie utilizzate per il progetto sono AngularJs per il client e NodeJs per il server

Stato del progetto

- Integrazione con FEDERA/SPID - (fatto)
- Integrazione con il software di Gestione Documentale (fatto)
- Interfacce che seguono le specifiche di design.italia.it (in sviluppo)
- Interfaccia di accoglimento istanze facilmente personalizzabile (in sviluppo)
- Interfacciamento dei flussi dati con i gestionali dell'ufficio (fatto filesystem, xls. In sviluppo Mdb)
- Open Source (fatto)


#### FINE DODUMENTO

## Integrazione Federa 

Client AngularJs - Server NodeJs

1) Il Client create un Token di Sessione per l'autorizzazione AuthToken
2) il token viene passato alla chiamata di autorizzazione e messo in sessione locale (localStorage)
3) il client chiama l'autenticazione SSO di FEDERA e passa nel RelayState il token
4) Avviene la procedura di autenticazione e l'IdP chiama la callback in post con il token
5) Viene creato un JWT token ed il clien viene rediretto con JWT e AuthToken
6) Nella landingPage viene verificato l'AuthToken che viene distrutto ed usato il JWT per le interazioni successive.



## Istanze digitali

Per il build del Client dentro la cartella ./Client eseguire gulp build:dest 

FEDERA TEST
Username: RUGGERO_RUGGERI_FEDERATEST
Dominio: federa.it
Passowd: NLepida.it





## TEST Con Shibboleth
// https://github.com/ritstudentgovernment/passport-saml-example
// https://www.testshib.org/metadata/testshib-providers.xml

// DOCS & NODE SAMPLE
// https://github.com/bergie/passport-saml 
// https://github.com/gbraad/passport-saml-example/
// https://github.com/ritstudentgovernment/passport-saml-example
// http://stackoverflow.com/questions/24092211/passport-saml-implementation


// TODO
// generato certificato
// copiato certificato da https://federatest.lepida.it/gw/metadata
// 'idp' => 'https://federatest.lepida.it/gw/metadata',	//federatest 


// TOOLS
// https://www.samltool.com/format_x509cert.php

// http://stackoverflow.com/questions/24092211/passport-saml-implementation
// rruggeri
// openidp.feide.no


//https://idp.ssocircle.com/sso/hos/SelfCare.jsp
//rruggeri
//ssocircle.com

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.





## Client - Autenticazione idee

- http://jasonwatmore.com/post/2016/04/05/angularjs-jwt-authentication-example-tutorial


Gestione accesso con passport

Lato nodejs - password + topken JWT



<!--
    <pre>vm.userForm.$valid = {{ vm.userForm.$valid | json }}</pre>
    <pre>vm.userForm.name.$error = {{ vm.userForm.name.$error | json }}</pre>
    <pre>vm.userForm.name.$touched = {{ vm.userForm.name.$touched | json }}</pre>
    <pre>vm.userForm = {{ vm.userForm| json }}</pre>
    <pre>vm.model.picFile1 = {{ vm.model.picFile1 }}</pre>
    
    
      
      <p>Form Data</p>
      <pre>{{vm.model | json}}</pre>
      <p>Form Error</p>
      <pre>{{vm.errors | json}}</pre>
    </div>
    <p>reCaptcha - http://vividcortex.github.io/angular-recaptcha/ </p>
    <p>hashMe.js - https://github.com/marcu87/hashme </p>
    <p>ng-file-upload - https://github.com/danialfarid/ng-file-upload </p>
    <p>csrf - https://www.theodo.fr/blog/2015/04/preventing-csrf-attacks-with-express-and-angularjs/ </p>
    <p>Serve static files in route - http://stackoverflow.com/questions/11569181/serve-static-files-on-a-dynamic-route-using-express </p>
    <p>CSS Input Style - http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/</p>
    <p>Double Mail - http://stackoverflow.com/questions/22173016/comparing-two-input-values-in-a-form-validation-with-angularjs</p>
    <p>UI-Validate - https://github.com/angular-ui/ui-validate </p>
    <div>
        <p>Output</p>
        <pre>{{outputStatusCode}}</pre>
        <pre>{{outputResponse}}</pre>
    </div>

-->
