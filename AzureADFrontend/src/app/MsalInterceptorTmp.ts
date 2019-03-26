import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { from } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Config } from 'src/assets/config';

// TODO: Remove when MSAL library supports Angular 7, and use MsalInterceptor instead

@Injectable()
export class MsalInterceptorTmp implements HttpInterceptor {
	constructor(private auth: MsalService, private broadcastService: BroadcastService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const scopes = Config.consentScopes;
		this.auth.verbose('Url: ' + req.url + ' maps to scopes: ' + scopes);
		if (scopes === null) {
			return next.handle(req);
		}
		console.log(scopes);
		const tokenStored = this.auth.getCachedTokenInternal(scopes);
		//console.log(tokenStored);
		if (tokenStored && tokenStored.token) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${tokenStored.token}`,
				}
			});
			return next.handle(req).do(event => { }, err => {
				if (err instanceof HttpErrorResponse && err.status === 401) {
					//const scopesl = this.auth.getScopesForEndpoint('http://localhost:4200');
					const scopesl = Config.consentScopes;
					const tokenStoredl = this.auth.getCachedTokenInternal(scopesl);
					if (tokenStoredl && tokenStoredl.token) {
						this.auth.clearCacheForScope(tokenStoredl.token);
					}
					this.broadcastService.broadcast('msal:notAuthorized', { err, scopesl });
				}
			});
		} else {
			return from(this.auth.acquireTokenSilent(scopes).then(token => {
				const JWT = `Bearer ${token}`;
				return req.clone({
					setHeaders: {
						Authorization: JWT,
					},
				});
			})).mergeMap(reql => next.handle(reql).do(event => { }, err => {
				if (err instanceof HttpErrorResponse && err.status === 401) {
					const scopesl = this.auth.getScopesForEndpoint(reql.url);
					const tokenStoredl = this.auth.getCachedTokenInternal(scopesl);
					if (tokenStoredl && tokenStoredl.token) {
						this.auth.clearCacheForScope(tokenStoredl.token);
					}
					this.broadcastService.broadcast('msal:notAuthorized', { err, scopesl });
				}
			})); // calling next.handle means we are passing control to next interceptor in chain
		}
	}
}
