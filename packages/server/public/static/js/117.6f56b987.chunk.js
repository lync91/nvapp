(this.webpackJsonpisomorphic=this.webpackJsonpisomorphic||[]).push([[117],{1148:function(e,t,o){"use strict";var n=o(43),a=o(193),r=o(192),i=o(194),c=o(762),l=o(1161),s=o.n(l),u=o(33),m=Object(u.a)({forceRefresh:!0}),d={clientID:"your_client_id",domain:"your_domain_name",allowedConnections:["Username-Password-Authentication"],rememberLastLogin:!0,language:"en",closable:!0,options:{auth:{autoParseHash:!0,responseType:"token id_token",redirect:!0,redirectUrl:"https://your_domain_name/auth0loginCallback"},languageDictionary:{title:"Isomorphic",emailInputPlaceholder:"demo@gmail.com",passwordInputPlaceholder:"demodemo"},theme:{labeledSubmitButton:!0,logo:"your_logo_url",primaryColor:"#E14615",authButtons:{connectionName:{displayName:"Log In",primaryColor:"#b7b7b7",foregroundColor:"#000000"}}}}},h=o(779),p=function(e){function t(){var e,o;Object(n.a)(this,t);for(var i=arguments.length,c=new Array(i),l=0;l<i;l++)c[l]=arguments[l];return(o=Object(a.a)(this,(e=Object(r.a)(t)).call.apply(e,[this].concat(c)))).lock=new s.a(d.clientID,d.domain,d.options),o.login=function(){o.lock&&o.lock.show()},o.handleAuthentication=function(){o.lock.on("authenticated",o.setSession),o.lock.on("authorization_error",(function(e){return Object(h.a)("error","Wrong mail or password")}))},o.setSession=function(e){var t=JSON.stringify(1e3*e.expiresIn+(new Date).getTime());localStorage.setItem("access_token",e.accessToken),localStorage.setItem("id_token",e.idToken),localStorage.setItem("expires_at",t),m.replace("/dashboard")},o.logout=function(){localStorage.removeItem("access_token"),localStorage.removeItem("id_token"),localStorage.removeItem("expires_at"),m.replace("/")},o.isAuthenticated=function(){var e=JSON.parse(localStorage.getItem("expiresAt"));return(new Date).getTime()<e},o}return Object(i.a)(t,e),t}(c.EventEmitter);t.a=new p},2610:function(e,t,o){"use strict";o.r(t);var n=o(0),a=o.n(n),r=o(1148),i=o(32);t.default=function(){return Object(n.useEffect)((function(){r.a.handleAuthentication(),i.a.login()}),[r.a.handleAuthentication]),a.a.createElement("p",null,"Loading ...")}},779:function(e,t,o){"use strict";o(340);var n=o(222);t.a=n.a}}]);
//# sourceMappingURL=117.6f56b987.chunk.js.map