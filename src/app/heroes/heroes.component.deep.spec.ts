import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { HeroComponent } from '../hero/hero.component';
import { By } from '@angular/platform-browser';

describe('HeoresComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroesService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ];
    mockHeroesService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroesService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroesService.getHeroes.and.returnValue(of(HEROES));

    // ran ngOnInit()
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentDEs.length).toBe(3);
    expect(heroComponentDEs[0].componentInstance.hero.name).toEqual('SpiderDude');
    expect(heroComponentDEs[1].componentInstance.hero.name).toEqual('Wonderful Woman');
    expect(heroComponentDEs[2].componentInstance.hero.name).toEqual('SuperDude');
  });

  it('should render each hero object correctly as a HeroComponent object in the HEROES array', () => {
    mockHeroesService.getHeroes.and.returnValue(of(HEROES));

    // ran ngOnInit()
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });
});
