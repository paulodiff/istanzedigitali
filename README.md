# Istanze Digitali
## Piccoli procedimenti "crescono" (in digitale)

## Descrizione

Il progetto implementa un framework agile e componibile per “abilitare” ad una serie di funzionalità previste 
dal CAD i piccoli procedimenti digitali della PA che non ci riescono. 
Nella pubblica amministrazione molti procedimenti interni sono gestiti attraverso gestionali obsoleti, 
fogli di calcolo o file e cartelle. 
Inoltre spesso vi sono procedimenti che nascono e muoiono velocemente. 
Per questo tipo di procedimenti risulta difficile se non impossibile disporre di una interfaccia web per 
raccogliere le istanze in ingresso, essere integrati con SPID, essere integrati con il gestore documentale interno, 
inviare le notifiche sullo stato del procedimento in maniera automatica al cittadino e raccogliere i dati in maniera strutturata.

> Questo framework vuole rispondere a questa esigenza.

### Le principali caratteristiche del framework sono:

-	Integrazione con SPID e FEDERA
-	Integrazione con il software di gestione documentale
-	Interfacce web che seguono le specifiche di design.italia.it
-	Interfaccia di accoglimento istanze facilmente personalizzabile
-	Invio notifiche al cittadino sullo stato dell'istanza presentata
-   Interfacciamento dei flussi dati con i gestionali dell'ufficio
-	Gestione memorizzazione e storico delle istanze presentate dal cittadino
-	Open Source

## Il caso d'uso tipico

Richiesta di prenotazione e rinnovo di una tipologia di autorizzazione. 
L'ufficio gestisce le autorizzazioni utilizzando un file di excel che non è integrato neanche con il protocollo.

    1) Si prepara il form dati per la richiesta dati con la possibilitò di allegare dei documenti
    2) Si comunica il link sul sito web dell'ente (il link sarà attivo per tutta la durata del rinnovo)
    3) I cittadini richiedenti si autenticano con SPID compilano i dati ed inviano l'istanza
    4) L'istanza viene protocollata, inoltrata all'ufficio competente
    5) Al cittadino viene inviata una informativa di avvio procedimento con il protocollo e tutte le informazioni necessarie
    6) I dati inviati vengono raccolti nella modalità più comoda per la gestione (excel)
    7) Al cittadino vengono inviate le notifiche sullo stato di avanzamento del procedimento

## Tecnologie

- Le Tecnologie utilizzate per il progetto sono AngularJs per il client e NodeJs per il server

## Stato del progetto

- Integrazione con FEDERA/SPID - (fatto)
- Integrazione con il software di Gestione Documentale (fatto)
- Interfacce che seguono le specifiche di design.italia.it (in sviluppo)
- Interfaccia di accoglimento istanze facilmente personalizzabile (in sviluppo)
- Interfacciamento dei flussi dati con i gestionali dell'ufficio (fatto filesystem, xls. In sviluppo Mdb)
- Invio della prima notifica ad avvenuta ricezione dell'istanza (fatto)
- Invio delle notifiche successive sullo stato dell'istanza (in sviluppo)
- Invio della notifica di completamente procediemento (in sviluppo)
- Open Source (fatto)

## Informazioni 

- Comune di Rimini - Ruggero Ruggeri ruggero.ruggeri AT comune.rimini.it 0541/7014607



#### FINE DODUMENTO


Per il build del Client dentro la cartella ./Client eseguire gulp build:dest 

FEDERA TEST
Username: RUGGERO_RUGGERI_FEDERATEST
Dominio: federa.it
Passowd: _1Lepida.it


Modellazione dello storico istanze

Lato utente:

Invio di una istanza
Riepilogo delle istanze inviate con stato.


Lato operatore

Visualizzazione istanza di un dato tipo
Modifica stato dell'istanza



-------------------------------------------------------------- 

todo

* check su post per sicurezza (token)

##istanza##
tipoIstanza: (idTipoIstanza)
templateFormly : todo
templateFormlyValidator : todo
AuthUuidV4 : identificativo autenticazione
statoIter relativi agli stati iter del tipo istanza
emailNotifiche: 
fileSystemId : ID di memorizzazione su FS (reqId)
protocolloIdDocumento, protocolloAnno,  protocolloNumero : riferimenti protocollo

##tipoIstanza##
storage
validazione
form
ufficioProtocollo
fascicoloProtocollo
tipodocumentoProtocollo
iterdocumentale
stati esterni (accettata, lavorazione, conclusione)
ogni stato ha una notifica

##operatore##

