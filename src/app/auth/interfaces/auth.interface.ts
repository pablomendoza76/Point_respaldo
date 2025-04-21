export interface AuthData {
  roles: Role[]
  token: string
  user: User
}

export interface User extends Credentials {
  _id: string
  persona: Person
}

export interface Credentials {
  usuario: string
  clave: string
}

export interface Person {
  _id: number
  nombre: string
  apellido: string
  sexo: string | null
  telefono: string | null
  correo: string
  nacionalidad: string | null
  url_pasaporte: string | null
  url_image: string | null
  fecha_nacimiento: string
}

export interface Role {
  _id: string
  nombre: string
}
