"use strict";

 angular.module('myApp.config', [])

.constant('ENV', 
		{	
			appVersion: '1.1',
			name:'DEV',
			// apiEndpoint:'https://istanze-dichiarazioni.comune.rimini.it/federa',

			apiEndpoint:'https://istanze-dichiarazioni.comune.rimini.it',
			apiLogin:'passportauth/login',
			apiLogout:'passportauth/logout',
			apiLoginCheck:'passportauth/check',
			apiProfile: 'profilemgr/me',
			apiUpload:'segnalazioni/upload',
			apiIstanzeUpload:'protocollo/upload',
			apiIstanzeRecuperaImpostazioni:'protocollo/getInfoIstanza',
			apiGatewayUrl :'protocollo/getGatewayAuthUrl',
			
			apiLoginNTLM:'loginmgr/NTLMlogin',
			apiLoginDEMO:'loginmgr/DEMOlogin',
			apiLoginLDAP:'loginmgr/LDAPlogin',
			apiLogoutLDAP:'loginmgr/LDAPlogout',
			apiPosta:'postamgr/posta',
			apiPostaCDC:'postamgr/cdc',
			apiDemanio:'demaniomgr',
			apiQueue:'queuemgr',
			
			routeAfterLogon:'consultazione',
			mapsdemo: false,
			debugFormDefaultData: true, // carica dati di default nella schermata 
			loginUserName:'',
			loginUserPassword:'',

			AUTH_EVENTS:{
				loginSuccess:'auth-login-success',
				loginFailed:'auth-login-failed',
				logoutSuccess:'auth-logout-success',
				sessionTimeout:'auth-session-timeout',
				notAuthenticated:'auth-not-authenticated',
				notAuthorized:'auth-not-authorized',
				serverError:'server-error',
				oldAppVersion:'old-app-version'
			},

			USER_ROLES:{
				all:'*',
				admin:'admin',
				editor:'editor',
				guest:'guest'
			}
		});