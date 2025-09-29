import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { AdDetail } from './ad-detail';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { ModalService } from '../../services/modal-service';
import CarAd from '../../models/CarAd';
import AuthData from '../../models/AuthData';

describe('AdDetail', () => {
  let component: AdDetail;
  let fixture: ComponentFixture<AdDetail>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let routeParamsSubject: BehaviorSubject<any>;

  const mockCarAd: CarAd = {
    _id: '123',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    description: 'Great car',
    fuelType: 'Gasoline',
    price: 25000,
    createdAt: new Date(),
    imageUrl: 'test-image.jpg',
    user: {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user'
    }
  };

  const mockAuthData: AuthData = {
    message: 'Login successful!',
    token: 'test-token',
    user: {
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    }
  };

  beforeEach(async () => {
    routeParamsSubject = new BehaviorSubject({ id: '123' });

    mockApiService = jasmine.createSpyObj('ApiService', [
      'fetchById',
      'deleteAd',
      'fetchCars'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', ['authData']);
    mockAuthService.authData.and.returnValue(mockAuthData);

    mockModalService = jasmine.createSpyObj('ModalService', ['openEditModal']);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      params: routeParamsSubject.asObservable()
    };

    mockApiService.fetchById.and.returnValue(of(mockCarAd));
    mockApiService.deleteAd.and.returnValue(of({}));
    mockApiService.fetchCars.and.returnValue(of([mockCarAd]));

    await TestBed.configureTestingModule({
      imports: [AdDetail],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with route parameters', () => {
    fixture.detectChanges();
    expect(component.adId).toBe('123');
  });

  it('should fetch ad details when adId is provided', () => {
    fixture.detectChanges();
    expect(mockApiService.fetchById).toHaveBeenCalledWith('123');
    expect(component.ad$).toBeDefined();
  });

  it('should set isAuthor to true when current user is the ad author', async () => {
    const matchingCarAd: CarAd = {
      ...mockCarAd,
      user: {
        _id: 'user123', // This should match the id in mockAuthData
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      }
    };
    mockApiService.fetchById.and.returnValue(of(matchingCarAd));
    
    fixture.detectChanges();
    
    // Wait for async operations in constructor
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.isAuthor$()).toBe(true);
  });

  it('should set isAuthor to false when current user is not the ad author', async () => {
    const differentUserAuthData: AuthData = {
      message: 'Login successful!',
      token: 'test-token',
      user: {
        id: 'different-user',
        username: 'differentuser',
        email: 'different@example.com',
        role: 'user'
      }
    };
    
    const differentUserAd: CarAd = {
      ...mockCarAd,
      user: {
        _id: 'another-user-id', // Different from the auth user id
        username: 'anotheuser',
        email: 'another@example.com',
        password: 'hashedpassword',
        role: 'user'
      }
    };
    
    mockAuthService.authData.and.returnValue(differentUserAuthData);
    mockApiService.fetchById.and.returnValue(of(differentUserAd));
    
    const newFixture = TestBed.createComponent(AdDetail);
    const newComponent = newFixture.componentInstance;
    
    newFixture.detectChanges();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(newComponent.isAuthor$()).toBe(false);
  });

  it('should return undefined from fetchAdDetails when no adId is provided', () => {
    component.adId = '';
    const result = component.fetchAdDetails();
    expect(result).toBeUndefined();
  });

  it('should return observable from fetchAdDetails when adId is provided', () => {
    component.adId = '123';
    const result = component.fetchAdDetails();
    expect(result).toBeDefined();
    expect(mockApiService.fetchById).toHaveBeenCalledWith('123');
  });

  it('should delete ad and navigate to home when deleteAd is called', async () => {
    component.adId = '123';
    
    await component.deleteAd();
    
    expect(mockApiService.deleteAd).toHaveBeenCalledWith('123', 'test-token');
    expect(mockApiService.fetchCars).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not delete ad when no token is available', async () => {
    mockAuthService.authData.and.returnValue(undefined);
    
    await component.deleteAd();
    
    expect(mockApiService.deleteAd).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should open edit modal with correct parameters', () => {
    component.adId = '123';
    component.ad$ = of(mockCarAd);
    
    component.openEditModal();
    
    expect(mockModalService.openEditModal).toHaveBeenCalledWith('123', component.ad$);
  });

  it('should handle route parameter changes', () => {
    fixture.detectChanges();
    
    routeParamsSubject.next({ id: '456' });
    
    expect(component.adId).toBe('456');
    expect(mockApiService.fetchById).toHaveBeenCalledWith('456');
  });

  it('should handle missing user in ad data', async () => {
    const adWithoutUser: CarAd = { ...mockCarAd, user: undefined };
    mockApiService.fetchById.and.returnValue(of(adWithoutUser));
    
    const newFixture = TestBed.createComponent(AdDetail);
    const newComponent = newFixture.componentInstance;
    
    newFixture.detectChanges();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(newComponent.isAuthor$()).toBe(false);
  });

  it('should handle auth service returning undefined', async () => {
    mockAuthService.authData.and.returnValue(undefined);
    
    const newFixture = TestBed.createComponent(AdDetail);
    const newComponent = newFixture.componentInstance;
    
    newFixture.detectChanges();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(newComponent.isAuthor$()).toBe(false);
  });
});
