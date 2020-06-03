import { TestBed, ComponentFixture } from "@angular/core/testing"
import { HeroComponent } from "./hero.component"
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('HeroComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroComponent>; // wrapper for component with a type to get intellisense support

  // Set up for integration tests using TestBed
  beforeEach(() => {
    // TestBed is what allows us to test component and its template running together
    // Create a special module just for testing purposes
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    // Create component - returns a ComponentFixture with additional properties than just the component itself would have
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'Batman', strength: 10 };

    expect(fixture.componentInstance.hero.name).toEqual('Batman')
  })
})