import { TestBed } from "@angular/core/testing"
import { HeroDetailComponent } from "./hero-detail.component"
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from '@angular/common'; // Location global var for browser

describe('HeroDetailComponent', () => {
  let fixture, mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    mockActivatedRoute = { // don't need to use jasmine spy to mock in this case, can just hand code
      snapshot: { paramMap: { get: () => { return '3'; } } }
    }
    mockHeroService = jasmine.createSpyObj('getHero', 'updateHero'); // pass in methods used in this test case
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);
  });


});