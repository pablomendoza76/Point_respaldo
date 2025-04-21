import { HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs'

export const connHandler = (error: HttpErrorResponse) => {
  if (error.status === 0) {
    console.error({
      title: `Error ${error.status}`,
      message: 'La conexión está presentando inconvenientes',
    })
  }
  return throwError(() => error)
}
