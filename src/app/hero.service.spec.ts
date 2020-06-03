import { TestBed, inject } from "@angular/core/testing"
import { HeroService } from "./hero.service"
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { Hero } from "./hero";

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);
    TestBed.configureTestingModule({
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService }
      ],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.get(HttpTestingController); // .get() looks inside dependency injection registry for this TestBed's module and finds the service that correlates to that type and gives us a handle to it

    service = TestBed.get(HeroService);
  });
  describe('getHero', () => {
    it('should call get with the correct URL', () => {
      service.getHero(4).subscribe(() => {
        // won't execute until flush() is executed below 
        // where data from flush({mock data to return}) is returned
      }); // make the call to the service

      const req = httpTestingController.expectOne('api/heroes/4'); // notice we expect this call, after we've actually made the call above
      req.flush({ id: 4, name: 'SuperDude', strength: 100 }); // the data that will be sent back when the request at the specified URL is hit in the actual HeroService

      httpTestingController.verify(); // if two calls to the service were made when we only expectOne() then this ensures the test will fail
    })
  });
});