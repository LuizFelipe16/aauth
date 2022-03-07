import { setupAPIClient } from './api';

// Assim podemos ter dois tipos de funcionamento para a mesma coisa, no lado do browser usando
// a api e no servidor instanciando e passando o contexto para funcionar
export const api = setupAPIClient();