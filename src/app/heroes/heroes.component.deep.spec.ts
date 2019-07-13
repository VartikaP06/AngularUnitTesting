import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { Directive, Input } from '@angular/core';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { HeroComponent } from '../hero/hero.component';
import { By } from '@angular/platform-browser';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

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
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroesService }
      ]
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

    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  it(`should call heroService.deleteHero when the Hero Component's
  delete method is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete');
    mockHeroesService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement
      .queryAll(By.directive(HeroComponent));
    (<HeroComponent>heroComponents[0].componentInstance)
      .delete.emit(undefined);

    expect(fixture.componentInstance.delete)
      .toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the list when the add button is clicked', () => {
    mockHeroesService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const name = 'Mr. Ice';
    mockHeroesService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);
  });

  it('should have the correct route for the first hero', () => {
    mockHeroesService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    const routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});
