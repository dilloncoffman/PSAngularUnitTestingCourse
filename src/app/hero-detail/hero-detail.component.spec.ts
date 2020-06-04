import { TestBed, ComponentFixture } from "@angular/core/testing"
import { HeroDetailComponent } from "./hero-detail.component"
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from '@angular/common'; // Location global var for browser
import { of } from "rxjs/internal/observable/of";
import { FormsModule } from "@angular/forms";

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

  it('should call updateHero when save is called', (done) => { // *** Passing 'done' tells Jasmine this is an ASYNC TEST so it will wait until we call the done() function before it finishes up the test
    mockHeroService.updateHero.and.returnValue(of({})); // can pass empty object because in save()'s function we ignore the return value
    fixture.detectChanges();

    fixture.componentInstance.save(); // async call (waits 250ms)

    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done();
    }, 300);
  });
});