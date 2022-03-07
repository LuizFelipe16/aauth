// criamos um erro específico pq se usamos só Error fica genérico.
export class AuthTokenError extends Error {
  constructor() {
    super("Error with authentication token.");
  }
}