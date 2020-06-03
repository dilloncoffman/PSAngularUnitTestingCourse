import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { of } from "rxjs/internal/observable/of";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'Batman', strength: 8 }, { id: 2, name: 'Superman', strength: 24 }, { id: 3, name: 'Deadpool', strength: 15 }];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']); // creates a mock service with array of methods

    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService } // when anyone asks for a HeroService, use the mockHeroService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run change detection to get lifecycle event of ngOnInit to fire which is where in the actual component this.getHeroes() is called
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  })
})