import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectComponent } from './project.component';
import { ProjectService } from './project.service';
import { Observable, of, pipe } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { UtilsService } from '@services/utils.service';
import { HomeService } from '../home/home.service';
import { ActivatedRouteStub } from '@testing/activated-route-stub';
import { TestUtils } from '@testing/utils';
import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FastFeedbackService } from '../../fast-feedback/fast-feedback.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewRelicService } from '@shared/new-relic/new-relic.service';
import { MockRouter } from '@testing/mocked.service';

export class MockElementRef extends ElementRef {
  constructor() { super(null); }
}

class Page {
  get programName() {
    return this.query<HTMLElement>('ion-title');
  }
  get topBubbles() {
    return this.queryAll<HTMLElement>('bubbles-top');
  }
  get milestones() {
    return this.queryAll<HTMLElement>('project-item');
  }
  fixture: ComponentFixture<ProjectComponent>;

  constructor(fixture: ComponentFixture<ProjectComponent>) {
    this.fixture = fixture;
  }
  private query<T>(selector: string): T {
    return this.fixture.nativeElement.querySelector(selector);
  }
  private queryAll<T>(selector: string): T[] {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }
}

class MockDocument {}

xdescribe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let page: Page;
  let projectSpy: jasmine.SpyObj<ProjectService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: ActivatedRouteStub;
  let utils: UtilsService;
  let homeSpy: jasmine.SpyObj<HomeService>;
  let fastfeedbackSpy: jasmine.SpyObj<FastFeedbackService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule],
      declarations: [ ProjectComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        UtilsService,
        NewRelicService,
        {
          provide: ElementRef,
          useClass: MockElementRef
        },
        {
          provide: ProjectService,
          useValue: jasmine.createSpyObj('ProjectService', ['getProject'])
        },
        {
          provide: HomeService,
          useValue: jasmine.createSpyObj('HomeService', ['getProgramName'])
        },
        {
          provide: FastFeedbackService,
          useValue: jasmine.createSpyObj('FastFeedbackService', ['pullFastFeedback'])
        },
        {
          provide: Router,
          useClass: MockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub({ activityId: 1 })
        },
        {
          provide: Document,
          useClass: MockDocument
        }
      ],
    })
    .compileComponents();
  }));

  const milestones = Array.from({length: 5}, (x, i) => {
    return {
      id: i + 1,
      name: 'm' + i,
      description: 'des' + i,
      isLocked: false,
      progress: (i + 1) / 10,
      Activity: Array.from({length: 3}, (y, j) => {
        return {
          id: i * 10 + j + 1,
          name: 'activity name' + j,
          isLocked: false,
          leadImage: '',
          progress: (i * 10 + j + 1) / 100,
        };
      })
    };
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    projectSpy = TestBed.get(ProjectService);
    routerSpy = TestBed.get(Router);
    routeStub = TestBed.get(ActivatedRoute);
    utils = TestBed.get(UtilsService);
    homeSpy = TestBed.get(HomeService);
    fastfeedbackSpy = TestBed.get(FastFeedbackService);
    // homeSpy.getProgramName.and.returnValue(of('program name'));
    fastfeedbackSpy.pullFastFeedback.and.returnValue(of({}));
    projectSpy.getProject.and.returnValue(of(milestones));
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('when testing onEnter(), should get correct data', () => {
    fixture.detectChanges();
    expect(component.loadingMilestone).toBe(false);
    expect(component.milestones).toEqual(milestones);
    expect(fastfeedbackSpy.pullFastFeedback.calls.count()).toBe(1);
  });

  describe('when testing trackScrolling()', () => {
    it('should get correct activeMilestoneIndex if active milestone is in middle', () => {
      fixture.detectChanges();
      // This is development code, using to check the position of the milestones
      // component.milestoneRefs.forEach(re => {
      //   console.log(re.nativeElement.offsetTop);
      // });
      component.trackScrolling({
        detail: {
          currentY: 1000
        },
        srcElement: {
          offsetHeight: 1000
        }
      });
      expect(component.activeMilestoneIndex).toEqual(2);
    });
    it('should get correct activeMilestoneIndex if active milestone is the last one', () => {
      fixture.detectChanges();
      component.trackScrolling({
        detail: {
          currentY: 3000
        },
        srcElement: {
          offsetHeight: 3000
        }
      });
      expect(component.activeMilestoneIndex).toEqual(4);
    });
  });

  it('when testing scrollTo(), should get correct activeMilestoneIndex', () => {
    fixture.detectChanges();
    component.scrollTo('milestone-2', 1);
    expect(component.activeMilestoneIndex).toEqual(1);
  });

  it('when testing goToActivity(), should navigate to the correct page', () => {
    component.goToActivity(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['app', 'activity', 1]);
  });
});

