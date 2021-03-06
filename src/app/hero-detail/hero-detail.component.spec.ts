import { TestBed, ComponentFixture, fakeAsync, async } from "@angular/core/testing"
import { HeroDetailComponent } from "./hero-detail.component"
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from '@angular/common'; // Location global var for browser
import { of } from "rxjs/internal/observable/of";
import { FormsModule } from "@angular/forms";
import { tick, flush } from "@angular/core/testing";

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>; // allows for intellisense
  let mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    mockActivatedRoute = { // don't need to use jasmine spy to mock in this case, can just hand code
      snapshot: { paramMap: { get: () => { return '3'; } } }
    }
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']); // pass in methods used in this test case
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'Superman', strength: 100 }))
  });

  it('should render the hero name in an h2 tag', () => {
    fixture.detectChanges(); // gets updated mockHeroService Superman data by forcing change detection

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERMAN'); // since we pipe it to uppercase in the template itself
  });

  // ***FAKEASYNC HELPER TO TEST ASYNC*** - can work with both a Promise and a setTimeout and other types of async code
  it('should call updateHero when save is called', fakeAsync(() => { // fakeAsync makes test synchronous
    mockHeroService.updateHero.and.returnValue(of({})); // can pass empty object because in save()'s function we ignore the return value
    fixture.detectChanges();

    fixture.componentInstance.save(); // async call (waits 250ms)
    tick(250); // ticks using Zone.js the exact amount of time as the 250ms in on our HeroDetailComponent save method
    // Zone.js lets us control the clock of our zone
    // could use flush() to call no matter how long async call is

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  // ASYNC HELPER TO TEST ASYNC - really only capable of working with Promises
  it('should call updateHero when save is called', async(() => { // async makes test synchronous
    mockHeroService.updateHero.and.returnValue(of({})); // can pass empty object because in save()'s function we ignore the return value
    fixture.detectChanges();

    fixture.componentInstance.save(); // async call (waits 250ms)

    fixture.whenStable().then(() => { // relying on Zone.js still
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    }) // tell component to wait until it has been stabilized (all Promises have been resolved)

  }));
});