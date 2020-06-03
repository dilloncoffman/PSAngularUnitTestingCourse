import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { of } from "rxjs/internal/observable/of";
import { NO_ERRORS_SCHEMA, Component, Input, Output, EventEmitter } from "@angular/core";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'Batman', strength: 8 }, { id: 2, name: 'Superman', strength: 24 }, { id: 3, name: 'Deadpool', strength: 15 }];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']); // creates a mock service with array of methods

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService } // when anyone asks for a HeroService, use the mockHeroService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroesComponent);
    mockHeroService.getHeroes.and.returnValue(of(HEROES)); // mock returning an Observable to avoid errors when this.getHeroes is called in teh ngOnInit lifecycle method of the HeroesComponent when it is initialized after fixture.detectChanges() is called below

    // run ngOnInit
    fixture.detectChanges(); // trigger to initialize HeroesComponent and HeroComponent which will cause their ngOnInit lifecycle methods to fire, this way our component's are already initialized when we get to the tests themselves
  });

  it('should render each hero as a HeroComponent', () => {
    // get a pointer to each <app-hero></app-hero> node in each li that is created for each hero
    const heroComponentDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));

    expect(heroComponentDebugElements.length).toEqual(3);
    // Check that every hero property on every HeroComponent matches up with the correct hero in the sample data that the parent component received and passed down in to the child component
    for (let i = 0; i < heroComponentDebugElements.length; i++) {
      expect(heroComponentDebugElements[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  it(`should call heroService.deleteHero when the Hero Component's delete
  button is clicked` , () => {
    spyOn(fixture.componentInstance, 'delete'); // spies on HeroesComponent delete method to check if it was called with the right hero below
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit to make what is returned above available on the HeroesComponent
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent)); // gets a list of the <app-hero></app-hero> instances in the HeroesComponent
    heroComponents[0].triggerEventHandler('delete', null); // telling debugElement for child component to trigger its event rather than telling the component to raise or emit its delete event

    // check that deleteMethod is called with correct hero using jasmine spyOn above and .toHaveBeenCalledWith(param)
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  })
})