import 'jest-extended';
import supertest from 'supertest';
import app from '../../src/app';

const request = supertest(app);

const testNom1 = 'Jean-Marc';
const testNom2 = 'Pierre';

beforeAll(async () => {
  //Initialiser joueur 1 et 2
  await request.post('/api/v1/jeu/demarrerJeu').send({ nom: testNom1 });
  await request.post('/api/v1/jeu/demarrerJeu').send({ nom: testNom2 });
});

describe('GET /api/v1/jeu/redemarrerJeu', () => {
  it("devrait répondre à un appel réussi et le réponse devrait être en JSON", async () => {
    const response = await request.get('/api/v1/jeu/redemarrerJeu');
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
  });

  it("devrait répondre à une mauvaise demande pour des joueurs supprimés", async () => {
    // Jouer avec des joueurs supprimer ne devrait pas fonctionner
    const response = await request.get('/api/v1/jeu/jouer/' + testNom1);
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.error).toInclude("n'existe pas");
    expect(response.body.error).toInclude(testNom1);
    
    const response2 = await request.get('/api/v1/jeu/jouer/' + testNom2);
    expect(response2.status).toBe(404);
    expect(response2.type).toBe("application/json");
    expect(response2.body.error).toInclude("n'existe pas");
    expect(response2.body.error).toInclude(testNom2);
  });
});
