import { HeroesComponent } from "./heroes.component"
import { of } from "rxjs/internal/observable/of";

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  // Need a mock HeroService
  let mockHeroService;

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'Batman', strength: 8 }, { id: 2, name: 'Superman', strength: 24 }, { id: 3, name: 'Deadpool', strength: 15 }];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

    component = new HeroesComponent(mockHeroService);
  })

  describe('delete', () => {
    it('should remove the indicated hero from the heroes list', () => {
      // tells deleteHero method we want it to return an Observable
      mockHeroService.deleteHero.and.returnValue(of(true));

      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    })
  })
})