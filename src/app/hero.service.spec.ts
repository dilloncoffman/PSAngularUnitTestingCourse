import { TestBed } from "@angular/core/testing"
import { HeroService } from "./hero.service"
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;

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
  });


});