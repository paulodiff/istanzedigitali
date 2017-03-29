# Istanze Digitali
## Piccoli procedimenti digitali "crescono"

## Descrizione

Nella pubblica amministrazione molti procedimenti interni sono gestiti attraverso piccoli gestionali, 
fogli di calcolo o file e cartelle. Inoltre spesso vi sono procedimenti che nascono e muoiono velocemente.
Per questo tipo di procedimenti risulta molto difficile e dispendioso poter disporre di una interfaccia web per 
raccogliere le istanze in ingresso, essere integrati con SPID ed il gestore documentale, ed inviare le notifiche 
sullo stato del procedimento in maniera automatica al cittadino.

> Questo framework vuole rispondere a questa esigenza.

### Le principali caratteristiche del framework sono:

-	Integrazione con FEDERA/SPID
-	Integrazione con il software di Gestione Documentale
-	Interfacce che seguono le specifiche di design.italia.it
-	Notifiche al cittadino dello stato dell'istanza
-	Interfaccia di accoglimento istanze facilmente personalizzabile
-   Interfacciamento dei flussi dati con i gestionali dell'ufficio
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
Passowd: NLepida.it


http://du.ilsole24ore.com/utenti/authfiles/loginaziende.aspx?caller_id=ComuneRimini&user_uniqueid=comrimini&user_role=comrimini



http://du.ilsole24ore.com/utenti/authfiles/loginaziende.aspx?caller_id=ComuneRimini&user_uniqueid=comrimini&user_role=comrimini&ignore_x_ip=1