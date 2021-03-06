import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { of } from "rxjs/internal/observable/of";
import { NO_ERRORS_SCHEMA, Directive, Input } from "@angular/core";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' } // listener for host event (in this case click), listen for click event on parent DOM node and when that is fired, call onClick() method below
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'Batman', strength: 8 }, { id: 2, name: 'Superman', strength: 24 }, { id: 3, name: 'Deadpool', strength: 15 }];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']); // creates a mock service with array of methods

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      providers: [
        { provide: HeroService, useValue: mockHeroService } // when anyone asks for a HeroService, use the mockHeroService
      ],
      // schemas: [NO_ERRORS_SCHEMA]
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

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // run ngOnInit to make what is returned above available on the HeroesComponent
    fixture.detectChanges();
    const name = 'Mr. Ice';

    mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 4 })) // pass back new hero like addHero in HeroesComponent add()
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement; // get handle to input box
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0]; // get handle to Add button for adding a hero

    inputElement.value = name; // simulates typing 'Mr. Ice' into input box by just setting its value
    addButton.triggerEventHandler('click', null); // null as 2nd arg because event object doesn't matter in this case

    fixture.detectChanges(); // trigger change detection to update buttons after Add button is 'clicked'

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent; // check to see the hero name is in the resulting HTML
    expect(heroText).toContain('Mr. Ice');
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // run ngOnInit to make what is returned above in beforeEach from HeroService available on the HeroesComponent
    // Get a hold of routerLink for very first hero, and check that the navigatedTo property from our mock RouterLinkDirectiveStub is set correctly
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent)); // get a handle to heroComponents collection (HeroComponent directives)

    let routerLink = heroComponents[0] // get the first HeroComponent in the list of them
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub); // get a handle to stub class

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});