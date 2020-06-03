import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { of } from "rxjs/internal/observable/of";
import { NO_ERRORS_SCHEMA, Component, Input, Output, EventEmitter } from "@angular/core";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  @Component({
    selector: 'app-hero',
    template: '<div></div>',
  })
  class MockHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'Batman', strength: 8 }, { id: 2, name: 'Superman', strength: 24 }, { id: 3, name: 'Deadpool', strength: 15 }];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']); // creates a mock service with array of methods

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, MockHeroComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService } // when anyone asks for a HeroService, use the mockHeroService
      ],
    })
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run change detection to get lifecycle event of ngOnInit to fire which is where in the actual component this.getHeroes() is called
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });

  // Count DOM elements produced for each hero in HEROES
  it('should create one li for each hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
  })
})