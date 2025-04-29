import { Injectable, OnDestroy } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { RouteState } from '@routing/interfaces/state.interface'
import { BehaviorSubject, Observable, filter } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class RoutingService implements OnDestroy {
  constructor(private router: Router) {
    this.initRouteListener()
  }

  private routeStateSubject = new BehaviorSubject<RouteState | null>(null)
  routeState$: Observable<RouteState | null> = this.routeStateSubject.asObservable()

  private initRouteListener() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root
      const state: RouteState = {
        url: this.router.url,
        path: root.firstChild?.routeConfig?.path || '',
        params: root.firstChild?.params || {},
        queryParams: root.queryParams,
        data: root.firstChild?.data || {},
        title: root.firstChild?.data?.['title'] || '',
      }
      this.routeStateSubject.next(state)
    })
  }

  getCurrentState(): RouteState | null {
    return this.routeStateSubject.value
  }

  updateState(state: Partial<RouteState>) {
    const current = this.getCurrentState() || ({} as RouteState)
    this.routeStateSubject.next({ ...current, ...state })
  }

  ngOnDestroy() {
    this.routeStateSubject.unsubscribe()
  }
}
